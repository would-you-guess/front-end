import "./Game2_result2.css";

import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import Game2_playerResult from "./Game2_playerResult.jsx";

import useRoomStore from "../../store/room/useRoomStore.js";
import useAudioStore from "../../store/bgm/useAudioStore.js";
import useFDGStore from "../../store/game/findDiffGame/useFDGStore.js";
import useFDGCanvasStore from "../../store/game/findDiffGame/useFDGCanvasStore.js";
import useFDGFileStore from "../../store/game/findDiffGame/useFDGFileStore.js";
import NewButton from "../../components/button/newButton.jsx";

import {findDiff_result} from "../../api/game/FindDiff.js";

const Game2_result2 = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  const { roomId } = useRoomStore();
  const { findDiffGameId } = useFDGStore();
  const { resetFDGFileStore } = useFDGFileStore();
  const { resetFDGCanvasStore } = useFDGCanvasStore();
  const { play, stop } = useAudioStore();

  useEffect(() => {
    play("/bgm/Result_bgm.mp3");

    return () => {
      stop();
    };
  }, []);

  useEffect(() => {
    const sync_func = async () => {
      const res = await findDiff_result(findDiffGameId);
      setPlayers(res);
    };
    sync_func();
  }, []);

  const goHome = () => {
    resetFDGFileStore();
    resetFDGCanvasStore();
    navigate(`/lobby/${roomId}`);
  };

  return (
    <div className="inner">
      <div className="game2 result container-stars">
        <div className="title">
          <strong>Result</strong>
        </div>
        <div className="game2-result-content">

          <div className="player-list">
            {players && players.map((player, index) => (
              <Game2_playerResult
                key={index}
                player={`${index + 1}`}
                userNickname={player.nickname}
                score={player.score}
              />
            ))}
          </div>

                    <div className="tropy">
            <div className="tropy-img"></div>
          </div>
        </div>
        {/* <NewButton onClick={goHome} className="homeBtn" /> */}
        <div class="pixel-container">
          <button class="pixel-btn">HOME</button>
        </div>
      </div>
    </div>
  );
};

export default Game2_result2;
