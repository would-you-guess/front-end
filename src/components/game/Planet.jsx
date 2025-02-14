import { useEffect, useRef, useState } from "react";
import { gsap, Power1 } from "gsap";
import { createPortal } from "react-dom"; // 포털 기능 import

import GameInfo from "../../pages/lobby/GameInfo";
import "./Planet.css";
// import Astronaut from "../../pages/lobby/Astronaut";

const Planet = ({ style, id, min, max, text, onClick, game }) => {
  const imagePath = `/images/planet/${id}.png`;

  const planetRef = useRef();

  const [hoveredGame, setHoveredGame] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // `.toFixed()`를 통해 반환된 '문자 데이터'를,
  // `parseFloat()`을 통해 소수점을 가지는 '숫자 데이터'로 변환
  const random = (min, max) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  };

  const floatingObj = (selector, delay, size) => {
    gsap.to("." + selector, {
      duration: random(1.5, 2.5),
      delay: random(0, delay),
      y: size,
      repeat: -1,
      yoyo: true,
      ease: Power1.easeInOut,
    });
  };

  useEffect(() => {
    floatingObj(id, min, max);
  }, []);

  const handleMouseOver = () => {
    gsap.to(planetRef.current, { scale: 1.3, duration: 1 });
  };

  const handleMouseOut = () => {
    gsap.to(planetRef.current, { scale: 1, duration: 1 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHoveredGame(game);
  };

  const handleClick = () => {
    setIsHovered(false);
    if (!isHovered) {
      setHoveredGame(null); // 마우스가 다른 행성 위에 있지 않은 경우에만 hoveredGame을 null로 설정
    }
  };

  const hoverSound = () => {
    const hoverAudio = new Audio("/sound_effects/hover_sound.mp3");
    hoverAudio.play();
  };

  const hoverSoundGame3 = () => {
    const hoverAudio = new Audio("/sound_effects/hover_sound_planet3.mp3");
    // hoverAudio.play();
  };

  return (
    <div
      className={`${id} item-hints`}
      style={style}
      ref={planetRef}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {createPortal(
        <div
          className="info-container" // 페이드 관련 클래스 제거
          style={{ display: hoveredGame === game ? "flex" : "none" }}
        >
          {hoveredGame === game && (
            <GameInfo
              mode={game === "game1" ? "Catch Spy" : "Find Difference"}
              title={
                game === "game1" ? "스파이를 찾아라!" : "틀린 부분을 찾아라!"
              }
              discription={
                game === "game1"
                  ? "그림을 보고 스파이를 색출하세요!"
                  : "그림을 보고 틀린 그림을 찾아보세요!"
              }
              onclick={handleClick}
            />
          )}
        </div>,
        document.body
      )}

      <div className="hint" data-position="4">
        <span className={`hint-dot ${id === "planet3" ? "locked-planet" : ""}`}>
          <img
            src={imagePath}
            alt="planet image"
            onClick={onClick}
            onMouseOver={id !== "planet3" ? hoverSound : hoverSoundGame3}
          />
          {/* {id === 'planet1' && (
            <Astronaut onClick={handleMouseEnter} />
          )} */}

          {id === "planet3" && (
            <img
              src="/images/planet/lock.png"
              style={{
                position: "absolute",
                width: "18%",
                top: "36%",
                left: "41.7%",
                opacity: "0.7",
              }}
            />
          )}
          {text && (
            <div className="hint-content">
              <p>{text}</p>
            </div>
          )}
        </span>
        {/* <span>
          {id !== "planet3" && (
            <img
              src="/images/planet/hintBtn.png"
              className="hintBtn"
              handleMouseEnter={handleMouseEnter}
            />
          )}
        </span> */}
      </div>
    </div>
  );
};

export default Planet;
