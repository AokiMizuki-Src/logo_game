import React, { useEffect } from "react";

type PopupProps = {
	message: string;
	onClose: () => void; // ポップアップを閉じるコールバック
};

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose(); // 3秒後にポップアップを閉じる
		}, 3000);
		return () => clearTimeout(timer); // クリーンアップ
	}, [onClose]);

	return <div className="popup">{message}</div>;
};

export default Popup;
