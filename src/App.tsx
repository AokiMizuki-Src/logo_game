import { useState } from "react";
import "./App.css";
import Game from "./Game";

const App: React.FC = () => {
	const [showGame, setShowGame] = useState<boolean>(false);
	// 正解数
	const [correctNum, setCorrectNum] = useState<number>(0);

	const handleCorrectUpdate = (newCorrectNum: number) => {
		setCorrectNum(newCorrectNum); // Gameから渡される正解数を更新
	};

	const gameStartHandler = () => {
		console.log("start");
		setShowGame(true);
	};
	return (
		<>
			<header>
				<div className="container">
					<div className="logo">
						<a href="">logo</a>
					</div>
					<nav className="header_nav">
						<ul>
							{showGame && (
								<li>
									Correct Answers: <span className="point">{correctNum}</span>
								</li>
							)}
						</ul>
					</nav>
				</div>
			</header>
			<main>
				<div className="container">
					{showGame && <Game onCorrectUpdate={handleCorrectUpdate} />}
					{!showGame && (
						<div className="wrapper">
							<h1 className="main_title neonText">LOGO GAME</h1>
							<p className="main_sub_title">- How many logos do you know? -</p>
							<button onClick={() => gameStartHandler()} className="start_btn">
								START
							</button>
						</div>
					)}
				</div>
			</main>
		</>
	);
};

export default App;
