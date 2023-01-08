export class Model {
  id: string;
  name: string;
  description: string;
  neuralNetType: string;
  versions: ModelVersion[] = [];

  constructor(props: any) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.neuralNetType = props.neuralNetType;
    if (props.versions) {
      props.versions.forEach(version => {
        this.versions.push(new ModelVersion(version));
      });
    }
  }

  static fromJson(data: object) {
    return new Model(data);
  }
}

export class ModelVersion {
  version: number;
  legacyId: string;
  dob: Date;
  wonVsLastVersion: number;
  lostVsLastVersion: number;
  comment: string;
  games: Game[] = [];

  constructor(props: any) {
    this.version = props.version;
    this.legacyId = props.legacyId;
    this.wonVsLastVersion = props.wonVsLastVersion;
    this.lostVsLastVersion = props.lostVsLastVersion;
    this.comment = props.comment;
    if (props.games) {
      props.games.forEach(game => {
        this.games.push(new Game(game));
      })
    }
  }
}

export class Game {
  id: number;
  B: string;
  W: string;
  komi: string;
  result: string;
  sgfUrl: string;

  constructor(props: any) {
    this.id = props.id;
    this.B = props.B;
    this.W = props.W;
    this.komi = props.komi;
    this.result = props.result;
    this.sgfUrl = props.sgfUrl;
  }
}
