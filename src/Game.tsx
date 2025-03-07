import { useEffect, useState } from "react";
import logos from "./assets/logo.json";
import Popup from "./popup";

type GameProps = {
	onCorrectUpdate: (correctNum: number) => void;
	onQuestionUpdate: (questionNum: number) => void;
	onTimeUpdate: (timeLeft: number) => void;
	onFinish: (finish: boolean) => void;
	onSteakUpdate: (flg: boolean) => void;
	questionNum: number;
	correctNum: number;
};

const Game: React.FC<GameProps> = ({
	onCorrectUpdate,
	questionNum,
	onQuestionUpdate,
	correctNum,
	onTimeUpdate,
	onFinish,
	onSteakUpdate,
}: GameProps) => {
	const [randomItem, setRandomItem] = useState<logo[]>([]);
	const [ansMsg, setAndMsg] = useState<string>("");
	const [timeLeft, setTimeLeft] = useState<number>(30); // 初期の時間制限（３0秒）

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
		const idx = [...array];
		const kmax = Math.floor(Math.random() * 100) + Math.floor(Math.random() * 100);
		for (let k = 0; k < kmax; k++) {
			const i = Math.floor(Math.random() * n);
			const j = Math.floor(Math.random() * n);
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
	// const resetCount = () => {
	// 	setNewAnswer();
	// 	onQuestionUpdate(0);
	// 	onCorrectUpdate(0);
	// 	setTimeLeft(30);
	// 	onSteakUpdate(false);
	// };

	// タイマーの管理
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timer); // タイマーをクリア
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// 親コンポーネントへ時間を通知
	useEffect(() => {
		onTimeUpdate(timeLeft);
	}, [timeLeft, onTimeUpdate]);

	// 初期化
	useEffect(() => {
		setNewAnswer();
	}, []);

	const answerHandler = (id: number) => {
		if (timeLeft === 0) {
			return;
		}

		if (answer && answer.id === id) {
			setAndMsg("Correct!");
			onCorrectUpdate(correctNum + 1);
			onSteakUpdate(true);
		} else {
			setAndMsg("Miss");
			onSteakUpdate(false);
		}

		// ポップアップを表示
		setShowPopup(true);
		// ポップアップを閉じる
		setTimeout(() => {
			setShowPopup(false);
		}, 800);
		setNewAnswer();
		onQuestionUpdate(questionNum + 1);
	};

	//親更新用
	useEffect(() => {
		if (timeLeft === 0) {
			onFinish(true);
		}
	}, [timeLeft, onFinish]);

	return (
		<>
			{showPopup && <Popup message={ansMsg} onClose={handleClosePopup} />}

			<div className="display">
				<div className="imgArea">{answer && <img src={answer.url} alt="logo" />}</div>
			</div>
			<div className="optionBtnArea">
				<h2>Question. {questionNum}</h2>
				{/* <button type="button" className="resetBtn" onClick={resetCount}>
					Reset
				</button> */}
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
