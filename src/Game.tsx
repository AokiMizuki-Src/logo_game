import { useEffect, useState } from "react";
import logos from "./assets/logo.json";
import Popup from "./popup";
import { toast, ToastContainer, Slide } from "react-toastify";

type GameProps = {
	onCorrectUpdate: (correctNum: number) => void;
	onQuestionUpdate: (questionNum: number) => void;
	onTimeUpdate: (timeLeft: number) => void;
	onFinish: (finish: boolean) => void;
	onSteakUpdate: (flg: boolean) => void;
	onPenaltyUpdate: (flg: boolean) => void;
	questionNum: number;
	correctNum: number;
};
const popIcon = ["🦄", "🚀", "🛸", "❤️‍🔥", "🧜🏻‍♀️", "🧞‍♂️"];

const Game: React.FC<GameProps> = ({
	onCorrectUpdate,
	questionNum,
	onQuestionUpdate,
	correctNum,
	onTimeUpdate,
	onFinish,
	onSteakUpdate,
	onPenaltyUpdate,
}: GameProps) => {
	// const [randomItem, setRandomItem] = useState<logo[]>([]);
	const [questions, setQuestions] = useState<logo[]>([]);
	const [ansIndex, setAnsIndex] = useState<number>(0); //正解の配列番号
	const [ansMsg, setAndMsg] = useState<string>("");
	const [timeLeft, setTimeLeft] = useState<number>(30); // 初期の時間制限（３0秒）

	// 前回のanswerを保持
	// const [previousAnswer, setPreviousAnswer] = useState<logo | null>(null);
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
		const shuffled = [...array];
		const kmax = Math.floor(Math.random() * 100) + Math.floor(Math.random() * 100);
		for (let k = 0; k < kmax; k++) {
			const i = Math.floor(Math.random() * n);
			const j = Math.floor(Math.random() * n);
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	};

	// ランダムなロゴを生成
	function createRandomLogos(): logo[] {
		return shuffleArray([...logos]);
	}
	// JSONファイルから取得しているロゴデータをランダムにして初期セット
	const [randomLogos, setRandomLogos] = useState<logo[]>(createRandomLogos);

	const handleUpdateQuestion = (arrayId: number): void => {
		// 正解をセット
		const newAnswer = randomLogos[arrayId];
		setAnswer(newAnswer);
		// ランダムのLOGO配列から正解を除き３つ選ぶ
		const theOthers = randomLogos.filter((_, index) => index !== arrayId);
		const dummyAns = shuffleArray([...theOthers]).slice(0, 3);
		// ４択をセット
		setQuestions(shuffleArray(dummyAns.concat(newAnswer)));
		console.log(questions);
	};

	// 初期化
	useEffect(() => {
		// 正解をセット
		const initialAnswer = randomLogos[questionNum];
		setAnswer(initialAnswer);
		// ランダムのLOGO配列から正解を除き３つ選ぶ
		const theOthers = randomLogos.filter((_, index) => index !== questionNum);
		const dummyAns = shuffleArray([...theOthers]).slice(0, 3);
		// ４択をセット
		setQuestions(shuffleArray(dummyAns.concat(initialAnswer)));
	}, []);

	useEffect(() => {
		// 用意しているlogoのmaxまで行ったら再シャッフル
		if (ansIndex + 1 === logos.length) {
			setRandomLogos(createRandomLogos);
			console.log("reshuffle!!!!!");
			setAnsIndex(0);
		} else {
			setAnsIndex(ansIndex + 1);
		}
	}, [questionNum]);

	// 新しい問題を設定
	// const setNewAnswer = () => {
	// 	const currentRandomItems = randomLogos();
	// 	let newAnswer: logo;
	// 	do {
	// 		newAnswer = currentRandomItems[Math.floor(Math.random() * currentRandomItems.length)];
	// 	} while (previousAnswer && newAnswer.id === previousAnswer.id);

	// 	setRandomItem(shuffleArray(currentRandomItems));
	// 	setAnswer(newAnswer);
	// 	setPreviousAnswer(newAnswer);
	// };

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

	const answerHandler = (id: number) => {
		if (timeLeft === 0) {
			return;
		}

		if (answer && answer.id === id) {
			setAndMsg("Correct!");
			onCorrectUpdate(correctNum + 1);
			onSteakUpdate(true);
			onPenaltyUpdate(false);

			// １０問正解ごとにPOP表示
			if (correctNum > 0 && correctNum % 10 === 0) {
				toast(`${popIcon[correctNum / 10 - 1] ?? "😘"} ${correctNum} Correct Answers Achieved!`, {
					closeOnClick: true,
					theme: "light",
					transition: Slide,
				});
			}
		} else {
			setAndMsg("Miss");
			onSteakUpdate(false);
			onPenaltyUpdate(true);
		}

		// ポップアップを表示
		setShowPopup(true);
		// ポップアップを閉じる
		setTimeout(() => {
			setShowPopup(false);
		}, 800);
		// setNewAnswer();
		handleUpdateQuestion(ansIndex);
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
			<ToastContainer theme="dark" />

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
				{questions.map((item) => (
					<button key={item.id} type="button" className="answerBtn" onClick={() => answerHandler(item.id)}>
						{item.name}
					</button>
				))}
			</div>
		</>
	);
};

export default Game;
