import * as React from 'react';
import BoardController from '../widgets/BoardController';
import SmartGoBoard from '../widgets/SmartGoBoard';
import { RouteComponentProps } from 'react-router-dom';
import GameClient from '../common/GameClient';
import UserPreferences from '../common/UserPreferences';
import Go from '../common/Go';
import SGF from '../common/SGF';
import { State } from '../components/Intersection';
import { ReviewRoomState, ReviewRoomInfo, Protocol } from 'deepleela-common';
import ThemeManager from '../common/ThemeManager';
import InputBox from '../widgets/InputBox';
import MessageBar from '../widgets/MessageBar';
import ChatBroLogin from './ChatBro';

interface RouteParam {
    roomId?: string;
}

interface Props extends RouteComponentProps<RouteParam> {

}

interface States {
    isOwner?: boolean;
    netPending?: boolean;
    roomInfo?: ReviewRoomInfo;
    message?: string;
}

export default class OnlineReivew extends React.Component<Props, States> {

    static smartBoard?: SmartGoBoard;

    private _smartBoard: SmartGoBoard;
    get smartBoard() { return this._smartBoard; }
    set smartBoard(value: SmartGoBoard) { this._smartBoard = OnlineReivew.smartBoard = value; }

    state: States = {};

    boardController: BoardController;
    readonly client = GameClient.default;
    roomId: string;
    pendingMessages: string[] = [];
    msgFadeOutTimer: NodeJS.Timer;

    componentDidMount() {
        let roomId = this.props.match.params.roomId;
        if (!roomId) {
            location.pathname = '/';
            return;
        }

        this.roomId = roomId;
        this.client.on('connected', () => this.enterReviewRoom());
        this.enterReviewRoom();
    }

    componentWillUnmount() {
        this.smartBoard.game.removeAllListeners();
        OnlineReivew.smartBoard = undefined;
    }

    async enterReviewRoom() {
        if (!this.client.connected) return;

        this.setState({ netPending: true });

        let roomInfo = await this.client.enterReviewRoom({
            roomId: this.roomId,
            uuid: UserPreferences.uuid,
            nickname: UserPreferences.nickname
        });

        if (!roomInfo) {
            location.pathname = '/';
            return;
        }

        if (roomInfo.chatBroId) { ChatBroLogin(roomInfo.chatBroId, 'online-review'); }

        this.setState({ isOwner: roomInfo.isOwner, netPending: false, roomInfo });
        if (!roomInfo.isOwner) {
            this.client.on(Protocol.sys.reviewRoomStateUpdate, this.onReviewRoomStateUpdate);
            this.client.on(Protocol.sys.reviewRoomMessage, this.onRoomMessage);
        }

        let game = SGF.import(roomInfo.sgf);

        // Restore last state
        if (this.smartBoard && this.smartBoard.game.history.length > 0) {
            let lastGame = this.smartBoard.game;
            game.game.history = lastGame.history;
            game.game.historyCursor = lastGame.historyCursor;
            game.game.historySnapshots = lastGame.historySnapshots;
            game.game.cursor = lastGame.cursor;
            game.game.branchCursor = lastGame.branchCursor;
        } else {
            game.game.changeCursor(-999);
        }

        this.smartBoard.importGame(game, 'review', roomInfo.isOwner, );
        this.smartBoard.changeCursor(0);
        this.smartBoard.showBranch();

        if (!roomInfo.isOwner) return;
        this.smartBoard.game.on('board', this.onBoardUpdate);

    }

    onBoardUpdate = (game: Go) => {
        this.client.updateReviewRoomState({
            roomId: this.roomId,
            cursor: game.cursor,
            branchCursor: game.branchCursor || -1,
            historyCursor: game.historyCursor,
            history: game.history,
            historySnapshots: game.historySnapshots,
        });
    }

    onReviewRoomStateUpdate = (roomState: ReviewRoomState) => {
        let game = this.smartBoard.game;

        if (game.history.length > 0 && (roomState.history || []).length === 0) {
            this.smartBoard.returnToMainBranch();
        }

        game.history = roomState.history || [];
        game.historySnapshots = roomState.historySnapshots || [];
        game.historyCursor = roomState.historyCursor === undefined ? -1 : roomState.historyCursor;
        game.cursor = roomState.cursor === undefined ? -1 : roomState.cursor;
        game.branchCursor = roomState.branchCursor === undefined ? -1 : roomState.branchCursor;
        this.smartBoard.changeCursor(0);
        this.smartBoard.showBranch();
    }

    onRoomMessage = (msg: string) => {
        this.pendingMessages.push(msg);

        this.setState({ message: undefined });

        setImmediate(() => {
            clearTimeout(this.msgFadeOutTimer);

            let msg = this.pendingMessages.pop();
            this.setState({ message: msg });

            this.msgFadeOutTimer = setTimeout(() => this.setState({ message: undefined }), 5000);
        });
    }

    render() {
        let isLandscape = window.innerWidth > window.innerHeight;
        let width = isLandscape ? (window.innerHeight / window.innerWidth * 100 - 7.5) : 100;
        let showMessageBox = this.state.roomInfo && this.state.isOwner && (!UserPreferences.chatBroId && !this.state.roomInfo.chatBroId);

        return (
            <div id='online-review' style={{ width: '100%', height: '100%', position: 'relative' }}>

                <div style={{ position: 'absolute', left: 0, top: 4, paddingLeft: 28 }}>
                    {
                        (this.smartBoard && this.smartBoard.game.snapshots.length === 19) && this.state.roomInfo && this.state.roomInfo.owner && !(this.state.roomInfo.isOwner) ?
                            <span style={{ fontSize: 10, color: ThemeManager.default.logoColor }}>By: {this.state.roomInfo.owner}</span>
                            : undefined
                    }
                </div>

                <div style={{ width: `${width}%`, height: '100%', margin: 'auto', marginTop: -8, }}>
                    <SmartGoBoard
                        id='smartboard' ref={e => this.smartBoard = e!}
                        disabled={!this.state.isOwner || this.state.netPending}
                        onEnterBranch={() => this.boardController && this.boardController.enterBranchMode()}
                    />
                </div>

                {
                    this.state.isOwner ?
                        <BoardController
                            ref={e => this.boardController = e!}
                            mode='review'
                            onCursorChange={d => this.smartBoard.changeCursor(d)}
                            onAIThinkingClick={() => this.smartBoard.peekSgfWinrate()}
                            onExitBranch={() => this.smartBoard.returnToMainBranch()}
                            style={{ position: 'fixed', zIndex: 2, transition: 'all 1s' }} />
                        : undefined
                }

                {
                    showMessageBox ?
                        <InputBox style={{ position: 'fixed', zIndex: 2 }} onSend={msg => this.client.sendRoomTextMessage(msg)} />
                        : undefined
                }

                <div className={this.state.message ? 'uk-animation-slide-bottom-small' : 'uk-animation-slide-top-small uk-animation-reverse'} style={{ width: '100%', position: 'absolute', bottom: 2, display: 'flex', justifyContent: 'center', zIndex: 5, pointerEvents: 'none' }}>
                    <MessageBar style={{ margin: 'auto' }} text={this.state.message} />
                </div>

            </div>
        );
    }
}