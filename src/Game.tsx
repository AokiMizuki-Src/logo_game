import { useEffect, useState } from "react";
import logos from "./assets/logo.json";
import Popup from "./popup";

type GameProps = {
	onCorrectUpdate: (correctNum: number) => void; // 親コンポーネントへの更新通知
};

const Game: React.FC<GameProps> = ({ onCorrectUpdate }) => {
	const [randomItem, setRandomItem] = useState<logo[]>([]);
	const [correctNum, setCorrectNum] = useState<number>(0);
	const [questionNum, setQuestionNum] = useState<number>(0);
	const [ansMsg, setAndMsg] = useState<string>("");

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
		const n = array.length;
		let idx = [...array];
		console.log("idx", idx);
		const kmax = Math.floor(Math.random() * 100) + Math.floor(Math.random() * 100);
		for (let k = 0; k < kmax; k++) {
			let i = Math.floor(Math.random() * n);
			let j = Math.floor(Math.random() * n);
			[idx[i], idx[j]] = [idx[j], idx[i]];
		}
		console.log("idx", idx);
		return idx;
		// return [...array].sort(() => 0.5 - Math.random());
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

	// リセット
	const resetCount = () => {
		setCorrectNum(0);
		setQuestionNum(0);
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
			console.log(correctNum);

			setAndMsg("Correct!");
			setCorrectNum((correctNum) => {
				const updatedCorrect = correctNum + 1;
				// 親コンポーネントに更新通知
				onCorrectUpdate(updatedCorrect);
				return updatedCorrect;
			});
		} else {
			setAndMsg("Miss");
			console.log("Miss");
		}
		// ポップアップを表示
		setShowPopup(true);
		// ポップアップを閉じる
		setTimeout(() => {
			setShowPopup(false);
		}, 800);
		setNewAnswer();
		setQuestionNum((correctNum) => correctNum + 1);
	};

	return (
		<>
			{showPopup && <Popup message={ansMsg} onClose={handleClosePopup} />}

			<div className="display">
				<div className="imgArea">{answer && <img src={answer.url} alt="logo" />}</div>
			</div>
			<div className="optionBtnArea">
				<h2>Quetion. {questionNum}</h2>
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
