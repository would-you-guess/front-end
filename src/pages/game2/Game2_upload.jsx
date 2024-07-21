import "./Game2.css";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import NewButton from "../../components/button/newButton";
import FDGUploadCanvas from "./canvas/FDGUploadCanvas.jsx";

import useRoomStore from "../../store/room/useRoomStore.js";
import useUserStore from "../../store/user/useUserStore.js";
import useSocketStore from "../../store/socket/useSocketStore.js";
import useAudioStore from "../../store/bgm/useAudioStore";
import useFDGCanvasStore from "../../store/game/findDiffGame/useFDGCanvasStore.js";
import useFDGFileStore from "../../store/game/findDiffGame/useFDGFileStore.js";

import ImgResizer from "./ImgResizer.js";
import { findDiff_upload } from "../../api/game/FindDiff.js";


const Game2_upload = () => {
  const navigate = useNavigate();

  const [oneClick, setOneClick] = useState(false);

  const imgUploadBtn = useRef(null);

  const { roomId } = useRoomStore();
  const { userId } = useUserStore();
  const { socket } = useSocketStore();
  const { play, stop } = useAudioStore();

  const { originalImage, maskingImage, aiGeneratedImage,
            setResizingImage, setMaskingImage, setAiGeneratedImage } = useFDGFileStore();
  const { FDGCanvasRef, startX, endX, startY, endY  } = useFDGCanvasStore();

  useEffect(() => {
    play("/bgm/Game2_bgm.mp3");

    return () => {
      stop();
    };
  }, []);

  const changeInput = async (e) => {
    const file = e.target.files[0];
    const resizingImg = await ImgResizer(file, 512, 512); // 512 변경 필요
    setResizingImage(resizingImg);
  };

  const sendToServer = async () => {
    if (oneClick) return;

    await FDGCanvasRef.toBlob( async (blob) => {
      setOneClick(true);
      setMaskingImage(blob);
      const upload_form = new FormData();
      upload_form.append('originalImage', originalImage, 'originalImage.png');
      upload_form.append('maskingImage', blob, 'maskingImage.png');
      upload_form.append("userId", userId);
      upload_form.append("prompt", "Modify safely.");
      upload_form.append("maskX1", Math.round(startX));
      upload_form.append("maskX2", Math.round(endX));
      upload_form.append("maskY1", Math.round(startY));
      upload_form.append("maskY2", Math.round(endY));

      const upload_res = await findDiff_upload(upload_form);
      if (upload_res.status === 200) {
        setAiGeneratedImage(upload_res.data.aiGeneratedImageUrl);
      }
    }, 'image/png');
  };

  const readyToStart = () => {
    navigate(`/loading`, {state : { title: "파일 업로드 중입니다." }});
    socket?.emit("game_loading", { roomId, nextPageUrl: "/game2?round=1" });
  }

  return (
    <div className="inner">
      <div className="game2 container">
        <div className="center">
          <div className="game2_border">
            <div className="titleContainer">
              <div>
                {originalImage === null ? (
                  <strong>Upload Your Image !</strong>
                ) : aiGeneratedImage == null ? (
                  <strong>Select your masking area</strong>
                ) : (
                  <strong>AI Image Generation Complete</strong>
                )}
              </div>
            </div>

            <div className="imageContainer">
              <div className="containerWrapper">
                <div className="game2-canvas-container">
                  <FDGUploadCanvas />
                  {aiGeneratedImage == null ? (
                    <div className="ai-generated-img-wrap"></div>
                  ) : (
                    <img src={aiGeneratedImage} className="ai-generated-img-wrap" />
                  )}
                </div>
              </div>

              <div className="imageBtnContainer">
                <input
                  type="file"
                  id="imageFile"
                  ref={imgUploadBtn}
                  onChange={changeInput}
                  accept="image/png"
                  style={{ display: "none" }}
                />
                {originalImage === null ? (
                  <NewButton text={"파일 업로드 하기!"} onClick={() => imgUploadBtn.current.click()}/>
                ) : aiGeneratedImage === null ? (
                  <NewButton text={"AI 이미지 생성하기!"} onClick={sendToServer}/>
                ) : (
                  <NewButton text={"게임 준비 완료!"} onClick={readyToStart}/>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game2_upload;
