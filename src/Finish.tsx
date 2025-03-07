import React, { useState } from "react";
import "./assets/Finish.css";

import db from "./firebase";
import { collection, addDoc } from "firebase/firestore";

type FinishProps = {
	questionNum: number;
	correctNum: number;
	score: number;
	onShowranking: (staus: boolean) => void;
};

type TypeOfScoreData = {
	correct: number;
	questions: number;
	name: string;
	score: number;
	timestamp: Date;
};

const Finish: React.FC<FinishProps> = ({ questionNum, correctNum, score, onShowranking }: FinishProps) => {
	const [scoreData, setScoreData] = useState<TypeOfScoreData>({
		correct: 0,
		questions: 0,
		name: "anonymous",
		score: 0,
		timestamp: new Date(),
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setScoreData((prev) => ({
			...prev,
			name: e.target.value,
		}));
	};

	const handleSubmit = async () => {
		if (!scoreData.name) return;

		try {
			scoreData.correct = correctNum;
			scoreData.questions = questionNum;
			scoreData.score = score;
			console.log(scoreData);

			const docRef = await addDoc(collection(db, "scores"), scoreData);
			console.log("書き込み成功:", docRef.id);
			onShowranking(true);
		} catch (er) {
			console.error("Errorっす", er);
			// TODO: トースターでエラー表示したい
		}
		console.log("submit!");
	};

	return (
		<>
			<div className="finish">
				<h1 className="finishTitle">Time up!</h1>
				<p>Thank you for playing!</p>
				<div className="finishScore">
					<p>Score: {score}</p>
					<p>
						Correct: {correctNum}/{questionNum}
					</p>
				</div>
				<div className="finishInputArea">
					<label htmlFor="finishInput">Please fill in your name!</label>
					<input
						type="text"
						className="finishInput"
						id="finishInput"
						placeholder="Your name"
						onChange={handleChange}
					/>
					<input type="button" className="finishInputBtn" value="OK" onClick={handleSubmit} />
				</div>
			</div>
		</>
	);
};

export default Finish;
