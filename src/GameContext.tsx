import React, { createContext, useState, ReactNode } from "react";

// ゲームの状態を管理する Context の型
type GameContextType = {
	questionNum: number;
	correctNum: number;
	setQuestionNum: React.Dispatch<React.SetStateAction<number>>;
	setCorrectNum: React.Dispatch<React.SetStateAction<number>>;
};

// ゲームの Context を作成
export const GameContext = createContext<GameContextType | undefined>(undefined);

// GameContext の Provider を作成
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [questionNum, setQuestionNum] = useState<number>(0);
	const [correctNum, setCorrectNum] = useState<number>(0);

	return (
		<GameContext.Provider value={{ questionNum, correctNum, setQuestionNum, setCorrectNum }}>
			{children}
		</GameContext.Provider>
	);
};
