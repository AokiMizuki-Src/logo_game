import { useContext, useEffect, useState } from "react";
import logos from "./assets/logo.json";
import Popup from "./popup";
import { GameContext } from "./GameContext";

type GameProps = {
	onCorrectUpdate: (correctNum: number) => void;
	onTimeUpdate: (timeLeft: number) => void;
	onFinish: (finish: boolean) => void;
};

const Game: React.FC<GameProps> = ({ onCorrectUpdate, onTimeUpdate, onFinish }) => {
	const [randomItem, setRandomItem] = useState<logo[]>([]);
	const [ansMsg, setAndMsg] = useState<string>("");
	const [timeLeft, setTimeLeft] = useState<number>(10); // 初期の時間制限（10秒）

	// 前回のanswerを保持
	const [previousAnswer, setPreviousAnswer] = useState<logo | null>(null);
	// 現在のanswer
	const [answer, setAnswer] = useState<logo | null>(null);
	// ポップアップ
	const [showPopup, setShowPopup] = useState(false);

	// GameContextから値を取得
	const gameContext = useContext(GameContext);
	if (!gameContext) return null; // gameContext が undefined の場合は何も表示しない
	const { questionNum, correctNum, setQuestionNum, setCorrectNum } = gameContext;

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
		const kmax = Math.floor(Math.random() * 100) + Math.floor(Math.random() * 100);
		for (let k = 0; k < kmax; k++) {
			let i = Math.floor(Math.random() * n);
			let j = Math.floor(Math.random() * n);
			[idx[i], idx[j]] = [idx[j], idx[i]];
		}
		return idx;
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

		setRandomItem(shuffleArray(currentRandomItems));
		setAnswer(newAnswer);
		setPreviousAnswer(newAnswer);
	};

	// リセット
	const resetCount = () => {
		setCorrectNum(0);
		setQuestionNum(0);
		setNewAnswer();
		onCorrectUpdate(0);
		setTimeLeft(30);
	};

	// タイマーの管理
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timer); // ここでタイマーをクリア
					onFinish(true);
					setQuestionNum(questionNum);
					setCorrectNum(correctNum);
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		// クリーンアップ関数でタイマーをクリア
		return () => clearInterval(timer);
	}, [questionNum, correctNum, onFinish, setQuestionNum, setCorrectNum]);

	// 親コンポーネントへ時間を通知
	useEffect(() => {
		onTimeUpdate(timeLeft);
	}, [timeLeft, onTimeUpdate]);

	useEffect(() => {
		setNewAnswer();
	}, []);

	const answerHandler = (id: number) => {
		if (timeLeft === 0) {
			onFinish(true);
			return;
		}

		if (answer && answer.id === id) {
			setAndMsg("Correct!");
			setCorrectNum((correctNum) => {
				const updatedCorrect = correctNum + 1;
				onCorrectUpdate(updatedCorrect);
				return updatedCorrect;
			});
		} else {
			setAndMsg("Miss");
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
				<h2>Question. {questionNum}</h2>
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
