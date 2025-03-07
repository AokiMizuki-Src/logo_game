import { collection, getDocs, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "./firebase";
import "./assets/Ranking.css";
import { FaRankingStar } from "react-icons/fa6";

interface TypeOfScoreData {
	id: string;
	correct: number;
	questions: number;
	name: string;
	score: number;
	timestamp: Date;
}

export const Ranking = () => {
	const [postData, setPostData] = useState<TypeOfScoreData[]>([]);
	useEffect(() => {
		//DBから取得
		const _data = collection(db, "scores");
		getDocs(_data).then((snapShot) => {
			setPostData(
				snapShot.docs
					.map((doc) => ({ id: doc.id, ...doc.data() } as TypeOfScoreData))
					.sort((a, b) => b.score - a.score)
			);
			console.log(postData);
			// snapShot.docs.map((doc) => {
			// 	console.log(typeof doc.data().timestamp.seconds);
			// 	console.log(typeof doc.data().questions);
			// 	console.log(typeof doc.data().correct);
			// });
		});
		onSnapshot(_data, (post) => {
			setPostData(
				post.docs
					.map((doc) => ({ id: doc.id, ...doc.data() } as TypeOfScoreData))
					.sort((a, b) => b.score - a.score)
			);
		});
	}, []);
	// function calcScore(correct: number, questions: number) {
	// 	const correctAnsRate = (correct / questions) * 100;
	// 	const result = questions * correctAnsRate;
	// 	return result;
	// }

	return (
		<div className="card">
			<h2 style={{ fontSize: "32px", color: "#fff" }}>
				<FaRankingStar style={{ verticalAlign: "bottom", paddingBottom: "5px", marginRight: "10px" }} />
				Ranking
			</h2>
			<ul className="ranking">
				{postData.map((item, index) => (
					<li key={item.id}>
						<div>{index + 1}</div>
						<div>{item.name}</div>
						<div>
							<div>{item.score}</div>({item.correct}/{item.questions})
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
