import { useEffect, useState } from "react";
import logos from "./assets/logo.json";
import Popup from "./popup";

type GameProps = {
	onCorrectUpdate: (correctNum: number) => void; // 親コンポーネントへの更新通知
};

const Game: React.FC<GameProps> = ({ onCorrectUpdate }) => {
	const [randomItem, setRandomItem] = useState<logo[]>([]);
	const [correctNum, setCorrectNum] = useState<number>(0);
	const [quetionNum, setQuetionNum] = useState<number>(0);

	// 前回のanswerを保持
	const [previousAnswer, setPreviousAnswer] = useState<logo | null>(null);
	// 現在のanswer
	const [answer, setAnswer] = useState<logo | null>(null);
	// ポップアップ
	const [showPopup, setShowPopup] = useState(false);

	type logo = {
		id: number;
		name: string;
		url: string;
	};

	const handleClosePopup = () => {
		setShowPopup(false);
	};

	// 配列をシャッフルする関数
	const shuffleArray = (array: logo[]): logo[] => {
		return [...array].sort(() => 0.5 - Math.random());
	};

	// ランダムなロゴを生成
	const randomLogos = (): logo[] => {
		return shuffleArray([...logos]).slice(0, 4);
	};

	// 新しい問題を設定
	const setNewAnswer = () => {
		const currentRandomItems = randomLogos();
		let newAnswer: logo;

		do {
			newAnswer = currentRandomItems[Math.floor(Math.random() * currentRandomItems.length)];
		} while (previousAnswer && newAnswer.id === previousAnswer.id);

		setRandomItem(shuffleArray(currentRandomItems)); // ボタンの順番をランダム化
		setAnswer(newAnswer);
		setPreviousAnswer(newAnswer);
	};

	const resetCount = () => {
		setCorrectNum(0);
		setQuetionNum(0);
		setNewAnswer();
		onCorrectUpdate(0);
	};

	useEffect(() => {
		setNewAnswer();
	}, []);

	const answerHandler = (id: number) => {
		console.log("clicked", id);
		if (answer && answer.id === id) {
			console.log("Correct!");
			setShowPopup(true);
			setCorrectNum((correctNum) => {
				const updatedCorrect = correctNum + 1;
				onCorrectUpdate(updatedCorrect); // 親コンポーネントに更新通知
				return updatedCorrect;
			});

			// ポップアップを閉じた後に新しい問題を設定
			setTimeout(() => {
				setShowPopup(false);
			}, 800);
			setNewAnswer();
		} else {
			console.log("Wrong!");
			setNewAnswer(); // 不正解時は即座に問題を切り替え
		}
		setQuetionNum((correctNum) => correctNum + 1);
	};

	return (
		<>
			{showPopup && <Popup message="Correct!" onClose={handleClosePopup} />}

			<div className="display">
				<div className="imgArea">{answer && <img src={answer.url} alt="logo" />}</div>
			</div>
			<div className="optionBtnArea">
				<h2>Quetion. {quetionNum}</h2>
				<button type="button" className="resetBtn" onClick={resetCount}>
					Reset
				</button>
			</div>

			<div className="ansBtnArea">
				{randomItem.map((item) => (
					<button key={item.id} type="button" className="answerBtn" onClick={() => answerHandler(item.id)}>
						{item.name}
					</button>
				))}
			</div>
		</>
	);
};

export default Game;
