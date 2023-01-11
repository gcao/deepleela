
export const lang = {
    title: 'Welcome to Daoqi!',
    human: 'Human',
    ai: 'AI',
    hint: 'Hint: rightclick or drag the board to adjust the view point.',
    B: 'Black',
    W: 'White',
    yes: 'Yes',
    no: 'No',

    menu: {
        cgos: 'CGOS',
        joseki: 'Joseki',
        gamelist: 'Games',

        newgame_vs_leela: 'Challenge AI',
        newgame_vs_self: 'Free Practice',
        newgame_ai_vs_ai: 'AI vs AI',
        loadsgf: 'Review SGF',
        exportsgf: 'Export SGF',

        showHeatmap: 'Show Heatmap',
        showWinrate: 'Show Winrate',

        undo: 'Undo',
        pass: 'Pass',
        resign: 'Resign',
        score: 'Score Game',

        settings: 'Settings',
        about: 'About',
    },

    aiLevel: {
        strongest: 'Strongest',
    },

    bot: {
        newestFast: 'Newest bot (1 sec/move)',
        newest    : 'Newest bot (5 secs/move)',
        newestSlow: 'Newest bot (30 secs/move)',
        oldFast   : 'Prev bot (1 sec/move)',
        old       : 'Prev bot (5 secs/move)',
        oldSlow   : 'Prev bot (30 secs/move)',
    },

    dialogs: {
        newgame: {
            title: 'New Game',
            yourColor: 'Your Color',
            engine: 'AI Engine',
            engineB: 'AI Engine (B)',
            engineW: 'AI Engine (W)',
            komi: 'Komi',
            handicap: 'Handicap',
            time: 'Time (minutes)',
            black: 'BLACK',
            white: 'WHITE',
            boardSize: 'Board Size',
        },

        sgf: {
            load: 'Review SGF',
            export: 'Export SGF',
            onlineMode: 'Online Mode',
            getChatBro: 'Get a ',
        },

        info: {
            title_score: 'Game Score',
            resigns: (color: string) => `${color} resigned`,
        },

        about: {
            title: 'About',
            text: {
                p1: 'DeepLeela is an open-source Go Learning Helper with Leela, which is an open-source go engine according to the AlphaGo paper.',
                p2: 'With DeepLeela, you can fight against Leela/LeelaZero, review your SGF, and get winrate information on your PC or your phone anywhere, anytime.',
                p3: 'If you like this project, you are welcome to sponsor us.',
                p4: 'leelazero@protonmail.com',
            },
        },

        settings: {
            title: 'Settings',
            themes: 'Themes',
            theme_default: 'Default',
            theme_purpink: 'Purpink',
            theme_sky_blue: 'Sky Blue',
            theme_sublime_vivid: 'Sublime Vivid',
            theme_timber: 'Timber',
            theme_simple_yellow: 'Simple Yellow',
            theme_dark: 'Dark',
            theme_metal: 'Metal',
            winrate: 'Custom Winrate',
            winrate_blackOnly: 'Black only',
            winrate_both: 'Show both winrates',
            winrateBase: 'Winrate Base',
            winrateBase_percent: 'Percent-based',
            winrateBase_500: '500-based',
            nickname: 'Nickname',
            aiWaitTime: 'AI Thinking Time(ms)',
            aiWaitRandom: 'Randomize AI Thinking Time',
        }
    },

    cgos: {
        black: 'Black',
        white: 'White',
        date: 'Date',
        time: 'Time',
        komi: 'Komi',
        result: 'Result',
    },

    notifications: {
        serversBusy: (number) => `Service is busy, try it later. Pending users: ${number}`,
        aiNotAvailable: `You won't get AI's suggestions at this moment.`,
        aiIsThinking: 'AI is Thinking...',
        invalidSgf: 'Invalid SGF format',
        resigns: (ai: string = 'AI') => `${ai} resigns.`,
        pass: (ai: string = 'AI') => `${ai} passes`,
    },

    button: {
        ok: 'OK',
        cancel: 'Cancel',
    },

    tips: {
        first: 'First',
        previous: 'Previous',
        backward: 'Go Back 10 Moves',
        forward: 'Go Forward 10 Moves',
        next: 'Next',
        last: 'Last',
        aithingking: 'Call AI',
        branch: 'Close Branch',
        anayltics: 'Global Analytics',
    },

    analysis: {
        black: 'Black Winrate',
        white: 'White Winrate',
        winrate: 'Winrate',
        delta: 'Delta',
        yourMove: 'Your Move',
        bestMove: 'Best Move',
    },
}