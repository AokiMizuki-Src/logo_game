import { useMemo, useState } from "react";
import "./assets/App.css";
import Game from "./Game";
import { MdOutlineTimer } from "react-icons/md";
import { FaRegSmile } from "react-icons/fa";
import Finish from "./Finish";
import { Ranking } from "./Ranking";
import { FaRankingStar } from "react-icons/fa6";

const App: React.FC = () => {
	const BASEPOINT = 50;
	const STREAKBONUS = 10;
	const [showTop, setShowTop] = useState<boolean>(true); // TOP
	const [showGame, setShowGame] = useState<boolean>(false); //ゲーム
	const [showFinish, setShowFinish] = useState<boolean>(false); // ゲーム終了
	const [showRanking, setShowRanking] = useState<boolean>(false); // ランキング

	// 正解数
	const [correctNum, setCorrectNum] = useState<number>(0);
	// 問題数
	const [questionNum, setQuestionNum] = useState<number>(0);
	// 残り時間
	const [timeLeft, setTimeLeft] = useState<number>(30);
	const [score, setScore] = useState<number>(0); // score
	const [streakNum, setStreakNum] = useState<number>(0); // 連続正解数
	const [prevAnsStatus, setPrevAnsStatus] = useState<boolean>(false);
	const [penalty, setPenalty] = useState<number>(50); // ミス | 初期値でscoreを０に相殺

	// Finish画面表示
	const handleFinishGame = (status: boolean) => {
		setShowGame(!status);
		setShowFinish(status);
		console.log("finish");
	};
	// Ranking画面表示
	const handleRanking = (status: boolean) => {
		setShowGame(!status);
		setShowFinish(!status);
		setShowTop(!status);
		setShowRanking(status);
	};
	// Game画面表示
	const gameStartHandler = () => {
		console.log("start");
		setShowGame(true);
		setShowTop(false);
	};

	const handleCorrectUpdate = (newCorrectNum: number) => {
		setCorrectNum(newCorrectNum);
	};
	const handleQuestionUpdate = (newQuestiontNum: number) => {
		setQuestionNum(newQuestiontNum);
	};
	const handleTimeUpdate = (newTimeLeft: number) => {
		setTimeLeft(newTimeLeft);
	};
	//連続正解数カウント
	const handleSteakUpdate = (flg: boolean) => {
		if (flg) {
			if (prevAnsStatus) {
				setStreakNum((prev) => prev + 1);
			}
			setPrevAnsStatus(true);
		} else {
			setStreakNum(0);
			setPrevAnsStatus(false);
		}
	};

	//Miss:-50point
	const handlePenalty = (flg: boolean) => {
		if (flg) {
			setPenalty(60);
		} else {
			setPenalty(0);
		}
	};
	useMemo(() => {
		setScore((pre) => pre + BASEPOINT + STREAKBONUS * streakNum - penalty);
	}, [questionNum]);

	useMemo(() => {
		console.log(`score: ${score}, streakNum: ${streakNum}, penalty: ${penalty}`);
	}, [score, streakNum, penalty]);
	return (
		<>
			<header>
				<div className="container">
					<nav className="header_nav">
						{showGame && (
							<ul>
								<li>
									<FaRegSmile />
									<span className="point">{score}</span>
									{/* <span className="point">
										{BASEPOINT * questionNum} + {STREAKBONUS * streakNum} - {penalty} = {score}
									</span> */}
								</li>
								<li>
									<MdOutlineTimer />
									<span className="point">{timeLeft}</span>s
								</li>
							</ul>
						)}
					</nav>
					<div className="headerRanking" title="Ranking" onClick={() => handleRanking(true)}>
						<FaRankingStar title="Ranking" />
					</div>
					<div className="logo">
						<a href="">logo</a>
					</div>
				</div>
			</header>
			<main>
				<div className="container">
					{showGame && (
						<Game
							onTimeUpdate={handleTimeUpdate}
							onCorrectUpdate={handleCorrectUpdate}
							questionNum={questionNum}
							correctNum={correctNum}
							onQuestionUpdate={handleQuestionUpdate}
							onFinish={handleFinishGame}
							onSteakUpdate={handleSteakUpdate}
							onPenaltyUpdate={handlePenalty}
						/>
					)}
					{showTop && (
						// {showGame && (
						<div className="wrapper">
							<h1 className="main_title neonText">LOGO GAME</h1>
							<p className="main_sub_title">- How many logos do you know? -</p>
							<button onClick={() => gameStartHandler()} className="start_btn">
								START
							</button>
						</div>
					)}
					{showFinish && (
						<Finish
							correctNum={correctNum}
							questionNum={questionNum}
							score={score}
							onShowRanking={handleRanking}
						/>
					)}
					{showRanking && <Ranking />}
				</div>
			</main>
			<footer>
				<p>© 2025 Mizuki Aoki</p>
			</footer>
		</>
	);
};

export default App;
