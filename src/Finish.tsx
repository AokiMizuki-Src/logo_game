import { useContext } from "react";
import "./Finish.css";
import { GameContext } from "./GameContext";

const Finish = () => {
	const gameContext = useContext(GameContext);

	if (!gameContext) return null; // gameContext が undefined の場合は何も表示しない
	const { questionNum, correctNum } = gameContext;

	return (
		<>
			<div className="finish">
				<h1 className="finishTitle">Time up!</h1>
				<p>Thank you for playing!</p>
				<div className="finishScore">
					<p>
						Correct:{correctNum}/{questionNum}
					</p>
				</div>
				<div className="finishInputArea">
					<label htmlFor="finishInput">Please fill in your name!</label>
					<input type="text" className="finishInput" id="finishInput" placeholder="Your name" />
					<input type="button" className="finishInputBtn" value="OK" />
				</div>
			</div>
		</>
	);
};

export default Finish;
