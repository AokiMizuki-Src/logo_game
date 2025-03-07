import { useEffect, useState } from "react";
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
	const [timeLeft, setTimeLeft] = useState<number>(10);
	const [score, setScore] = useState<number>(0); // score
	const [streakNum, setStreakNum] = useState<number>(0); // score

	useEffect(() => {
		setScore(() => {
			const result = BASEPOINT * questionNum + STREAKBONUS * streakNum;
			return result;
		});
	}, [questionNum, streakNum]);

	const handleSteakUpdate = (flg: boolean) => {
		if (flg === true) {
			setStreakNum(streakNum + 1);
		} else {
			setStreakNum(0);
		}
	};

	const handleFinishGame = (status: boolean) => {
		setShowGame(!status);
		setShowFinish(status);
		console.log("finish");
	};
	const handleRanking = (status: boolean) => {
		setShowGame(!status);
		setShowFinish(!status);
		setShowTop(!status);
		setShowRanking(status);
	};

	const handleCorrectUpdate = (newCorrectNum: number) => {
		// Gameから渡される正解数を更新
		setCorrectNum(newCorrectNum);
	};
	const handleQuestionUpdate = (newQuestiontNum: number) => {
		// Gameから渡される正解数を更新
		setQuestionNum(newQuestiontNum);
	};

	const handleTimeUpdate = (newTimeLeft: number) => {
		setTimeLeft(newTimeLeft);
	};

	const gameStartHandler = () => {
		console.log("start");
		setShowGame(true);
		setShowTop(false);
	};
	console.log(questionNum);
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
							onShowranking={handleRanking}
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
