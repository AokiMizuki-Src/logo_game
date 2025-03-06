import { useContext, useState } from "react";
import "./Finish.css";
import { GameContext } from "./GameContext";
import firebase from "firebase/compat/app";
import db from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";

type FinishProps = {
	numbers: number[];
};

type ScoreData = {
	name: string;
	score: number;
};

const Finish: React.FC<FinishProps> = (props) => {
	const gameContext = useContext(GameContext);
	console.log(gameContext);
	// console.log("props.correct", props.correct);
	// console.log("props.quetion", props.question);

	const [scoreData, setScoreDatas] = useState<ScoreData | null>(null);

	if (!gameContext) return null; // gameContext が undefined の場合は何も表示しない
	// const { questionNum, correctNum } = gameContext;

	// setDoc(doc(db, "scores"), scoreData)

	function postScore() {
		setDoc(doc(collection(db, "scores")), {
			name: scoreData?.name,
			score: scoreData?.score,
		});
	}

	return (
		<>
			<div className="finish">
				<h1 className="finishTitle">Time up!</h1>
				<p>Thank you for playing!</p>
				<div className="finishScore">
					<p>
						Correct:{props.numbers[0]}/{props.numbers[1]}
					</p>
				</div>
				<div className="finishInputArea">
					<label htmlFor="finishInput">Please fill in your name!</label>
					{/* <input
						type="text"
						className="finishInput"
						id="finishInput"
						placeholder="Your name"
						onChange={(e) => setScoreDatas({ name: e.target.value, score: correct })}
						value={scoreData?.name}
					/> */}
					<input type="button" className="finishInputBtn" value="OK" onClick={postScore} />
				</div>
			</div>
		</>
	);
};

export default Finish;
