import { Command } from "@sabaki/gtp";
import { StoneColor } from './Constants';

export default class CommandBuilder {

    static nameCommand(id?: number): Command {
        return { id, name: 'name' };
    }

    static version(id?: number): Command {
        return { id, name: 'version' };
    }

    static protocol_version(id?: number): Command {
        return { id, name: 'protocol_version' };
    }

    static known_command(cmd: string, id?: number): Command {
        return { id, name: 'known_command', args: [cmd] };
    }

    static list_commands(id?: number): Command {
        return { id, name: 'list_commands', };
    }

    static quit(id?: number): Command {
        return { id, name: 'quit' };
    }

    static boardsize(size = 19, id?: number): Command {
        return { id, name: 'boardsize', args: [size] };
    }

    static clear_board(id?: number): Command {
        return { id, name: 'clear_board' };
    }

    static komi(komi = 6.5, id?: number): Command {
        return { id, name: 'komi', args: [komi] };
    }

    static loadSgf(sgf: string, id?: number): Command {
        return { id, name: 'loadsgf', args: [sgf] };
    }

    static fixed_handicap(numberOfStones: number, id?: number): Command {
        return { id, name: 'fixed_handicap', args: [numberOfStones] };
    }

    static place_free_handicap(numberOfStones: number, id?: number): Command {
        return { id, name: 'place_free_handicap ', args: [numberOfStones] };
    }

    static set_free_handicap(numberOfStones: number, id?: number): Command {
        return { id, name: 'set_free_handicap', args: [numberOfStones] };
    }

    static play(color: StoneColor, move: string, id?: number): Command {
        return { id, name: 'play', args: [color, move] };
    }

    static genmove(color: StoneColor, id?: number): Command {
        return { id, name: 'genmove', args: [color] };
    }

    static undo(id?: number): Command {
        return { id, name: 'undo' };
    }

    static time_settings(main: number, byo_yomi_seconds: number, byo_yomi_stones: number, id?: number): Command {
        return { id, name: 'time_settings', args: [main, byo_yomi_seconds, byo_yomi_stones] };
    }

    static time_left(color: StoneColor, time: number, stones: number, id?: number): Command {
        return { id, name: 'time_left', args: [color, time, stones] };
    }

    static final_score(id?: number): Command {
        return { id, name: 'final_score', };
    }

    static final_status_list(status: string, id?: number): Command {
        return { id, name: 'final_status_list', args: [status] };
    }

    static showboard(id?: number): Command {
        return { id, name: 'showboard' };
    }

    static leela_heatmap(id?: number): Command {
        return { id, name: 'heatmap' };
    }
}