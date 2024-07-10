import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import NewButton from "../../components/button/newButton";
import axios from "axios";
import User from "../../components/game/User";
import "./Game2.css";
import "swiper/css";

const Game2 = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const previewImage = useRef(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
        const response = await axios.get(
          `http://localhost:8080/api/image/gen/mode2/${roomId}`
        );
        setImages(response.data);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    images.forEach((image, index) => {
      setTimeout(() => {
        console.log(image);
        previewImage.current.style.backgroundImage = `url(${image})`;
        if (index === images.length - 1) {
          setTimeout(() => {
            navigate("/game2/result");
          }, 5000); // 마지막 이미지 표시 시간 (5초)
        }
      }, index * 5000); // 0초, 5초, 10초(5초 간격으로 넘어감)
    });
  }, []);

  return (
    <div className="inner">
      {" "}
      <div className="game container">
        <div className="left-section">
          <User />
          <User />
          <User />
          <User />
        </div>
        <div className="center">
          <div className="game2_border">
            <div className="titleContainer">
              <div>
                <strong>Find Diffrence !</strong>
              </div>
            </div>
            <div className="imageContainer">
              <div className="findDiffrence" ref={previewImage}></div>
              <div className="magnifierContainer">
                <NewButton
                  text={
                    <div>
                      <img
                        src="/images/magnifier.png"
                        style={{ width: "2rem" }}
                      />
                      <img
                        src="/images/magnifier.png"
                        style={{ width: "2rem" }}
                      />
                      <img
                        src="/images/magnifier.png"
                        style={{ width: "2rem" }}
                      />
                    </div>
                  }
                ></NewButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game2;
