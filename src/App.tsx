import { useState } from "react";
import "./App.css";
import Game from "./Game";
import { MdOutlineTimer } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import Finish from "./Finish";

const App: React.FC = () => {
	const [showTop, setShowTop] = useState<boolean>(true);
	const [showGame, setShowGame] = useState<boolean>(false);
	// 正解数
	const [correctNum, setCorrectNum] = useState<number>(0);
	// 問題数
	const [questionNum, setQuestionNum] = useState<number>(0);
	// 残り時間
	const [timeLeft, setTimeLeft] = useState<number>(10);
	// ゲーム終了
	const [showFinish, setShowFinish] = useState<boolean>(false);

	// ゲーム終了時の処理
	// const handleFinishGame = (questions: number, corrects: number) => {
	// 	setQuestionNum(questions);
	// 	setCorrectNum(corrects);
	// 	setShowGame(false);
	// 	setShowFinish(true);
	// };

	const handleFinishGame = (status: boolean) => {
		setShowGame(!status);
		setShowFinish(status);

		console.log("finish");
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
									<FaCheckCircle />
									<span className="point">
										{correctNum}/{questionNum}
									</span>
								</li>
								<li>
									<MdOutlineTimer />
									<span className="point">{timeLeft}</span>s
								</li>
							</ul>
						)}
					</nav>
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
						/>
					)}
					{showTop && (
						<div className="wrapper">
							<h1 className="main_title neonText">LOGO GAME</h1>
							<p className="main_sub_title">- How many logos do you know? -</p>
							<button onClick={() => gameStartHandler()} className="start_btn">
								START
							</button>
						</div>
					)}
					{showFinish && <Finish numbers={[correctNum, questionNum]} />}
				</div>
			</main>
			<footer>
				<p>© 2025 Mizuki Aoki</p>
			</footer>
		</>
	);
};

export default App;
