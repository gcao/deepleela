export default {
  "id": "modelcao",
  "name": "Model-Cao-2",
  "description": "The second model trained by Cao",
  "neuralNetType": "b20c256",
  "versions": [
    {
      "version": 1,
      "legacyId": "daoqi-s545664-d114505",
      "dob": "10/20/2022",
      "wonVsLastVersion": 25,
      "lostVsLastVersion": 0,
      "comment": "",
      "training": {
        "selfPlayGames": 1000,
        "maxVisits": 1200
      },
      "games": [
        {
          "id": 1,
          "B": "modelcao-v0",
          "W": "modelcao-v1",
          "komi": "5.5",
          "result": "W+5.5",
          "sgfUrl": "/games/modelcao/gatekeeper/v1/1.sgf"
        },
        {
          "id": 2,
          "B": "modelcao-v0",
          "W": "modelcao-v1",
          "komi": "6",
          "result": "W+6",
          "sgfUrl": "/games/modelcao/gatekeeper/v1/2.sgf"
        }
      ]
    }
  ]
}