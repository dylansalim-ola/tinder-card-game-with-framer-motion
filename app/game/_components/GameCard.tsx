/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Dispatch, SetStateAction } from "react";

import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

import { useGameContext } from "@/store/gameContext";
import { card } from "@/types/games.type";
import SvgIconScoreLeaf from "@/components/svg/score-leaf.svg";

type Props = {
  id: number;
  data: card;
  setCardAnimation: Dispatch<SetStateAction<any>>;
};

type cardSwipeDirection = "left" | "right";

const GameCard = ({ id, data, setCardAnimation }: Props) => {
  const { game, handleSetOptions } = useGameContext();
  const { currentGame, score } = game;

  const { affirmation } = data;
  const x = useMotionValue(0);

  const inputX = [-150, 0, 150];
  const outputX = [-200, 0, 200];
  const outputY = [50, 0, 50];
  const outputRotate = [-40, 0, 40];
  const outputActionScaleBadAnswer = [3, 1, 1];
  const outputActionScaleRightAnswer = [1, 1, 3];
  const outputMainBgColor = ["#FF0000", "#daeff2", "#94ff00"];

  const offsetBoundary = 150;

  let drivenX = useTransform(x, inputX, outputX);
  let drivenY = useTransform(x, inputX, outputY);
  let drivenRotation = useTransform(x, inputX, outputRotate);
  let drivenActionLeftScale = useTransform(
    x,
    inputX,
    outputActionScaleBadAnswer
  );
  let drivenActionRightScale = useTransform(
    x,
    inputX,
    outputActionScaleRightAnswer
  );
  let drivenBg = useTransform(x, inputX, outputMainBgColor);

  useMotionValueEvent(drivenActionLeftScale, "change", (latest) => {
    //@ts-ignore
    setCardAnimation((state) => ({
      ...state,
      buttonScaleBadAnswer: drivenActionLeftScale,
      buttonScaleGoodAnswer: drivenActionRightScale,
      mainBgColor: drivenBg,
    }));
  });

  const handleScore = (direction: cardSwipeDirection) => {
    const currentCard = currentGame[currentGame.length - 1];
    const scoreIncrement = currentCard.answer === direction ? 1 : 0;
    return score + scoreIncrement;
  };

  return (
    <>
      <motion.div
        id={`cardDrivenWrapper-${id}`}
        className="absolute bg-white p-8  rounded-lg text-center w-full aspect-[100/150] pointer-events-none text-black origin-bottom shadow-card"
        style={{
          y: drivenY,
          rotate: drivenRotation,
          x: drivenX,
        }}
      >
        <div
          id="metrics"
          className="flex w-full justify-between items-baseline"
        >
          <div className="text-grey-500">
            <span className="text-[62px] leading-none">{id}</span>
            <span className="text-[29px] ml-1">
              /<span className="ml-[2px]">10</span>
            </span>
          </div>
          <div className="flex ">
            <div className="text-[50px] text-grey-500 leading-none">
              {score}
            </div>
            <SvgIconScoreLeaf className="w-[30px] h-auto" />
          </div>
        </div>
        <div
          id="illustration"
          className="w-2/3 mx-auto max-w-[200px] aspect-square rounded-full bg-green-500 mt-4"
        ></div>
        <p id="affirmation" className="mt-6 text-[20px]">
          {affirmation}
        </p>
      </motion.div>

      <motion.div
        id={`cardDriverWrapper-${id}`}
        className={`absolute w-full aspect-[100/150] hover:cursor-grab active:cursor-grab select-none`}
        drag="x"
        dragSnapToOrigin
        dragElastic={0.06}
        dragConstraints={{ left: 0, right: 0 }}
        dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
        onDragEnd={(_, info) => {
          const isOffBoundary =
            info.offset.x > offsetBoundary || info.offset.x < -offsetBoundary;
          const direction = info.offset.x > 0 ? "right" : "left";
          if (isOffBoundary) {
            handleSetOptions({
              currentGame: currentGame.slice(0, -1),
              score: handleScore(direction as cardSwipeDirection),
            });
          }
        }}
        style={{ x }}
      ></motion.div>
    </>
  );
};

export default GameCard;
