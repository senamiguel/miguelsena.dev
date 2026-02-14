
"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './Win95Player.module.css';

export default function Win95Player() {
	const nodeRef = useRef<HTMLDivElement | null>(null);
	const draggingRef = useRef(false);
	const startRef = useRef({ x: 0, y: 0, elX: 0, elY: 0, w: 0, h: 0 });
	const pointerIdRef = useRef<number | null>(null);

	const [pos, setPos] = useState(() => ({ x: 16, y: 120 }));

	useEffect(() => {
		const el = nodeRef.current;
		if (el) {
			const rect = el.getBoundingClientRect();
			if (!(rect.left === 0 && rect.top === 0)) {
				setPos({ x: rect.left, y: rect.top });
			}
		}
	}, []);


	useEffect(() => {
		return () => {
			try {
				window.removeEventListener('pointermove', onWindowPointerMove as any);
				window.removeEventListener('pointerup', onWindowPointerUp as any);
			} catch (_) {}
		};
	}, []);

	const onWindowPointerMove = (ev: PointerEvent) => {
		if (!draggingRef.current) return;
		const dx = ev.clientX - startRef.current.x;
		const dy = ev.clientY - startRef.current.y;
		let newX = startRef.current.elX + dx;
		let newY = startRef.current.elY + dy;

		const maxX = window.innerWidth - startRef.current.w;
		newX = Math.max(0, Math.min(newX, maxX));
		newY = Math.max(-startRef.current.h, newY);
		setPos({ x: newX, y: newY });
	};

	const onWindowPointerUp = (ev: PointerEvent) => {
		if (pointerIdRef.current !== null) {
			try {
				nodeRef.current?.releasePointerCapture(pointerIdRef.current);
			} catch (_) {}
		}
		draggingRef.current = false;
		pointerIdRef.current = null;
		window.removeEventListener('pointermove', onWindowPointerMove as any);
		window.removeEventListener('pointerup', onWindowPointerUp as any);
	};

	const onPointerDown = (e: React.PointerEvent) => {
		const el = nodeRef.current;
		if (!el) return;
		el.setPointerCapture?.(e.pointerId);
		pointerIdRef.current = e.pointerId;
		draggingRef.current = true;
		const rect = el.getBoundingClientRect();
		startRef.current = {
			x: e.clientX,
			y: e.clientY,
			elX: pos.x,
			elY: pos.y,
			w: rect.width,
			h: rect.height,
		};

		window.addEventListener('pointermove', onWindowPointerMove as any);
		window.addEventListener('pointerup', onWindowPointerUp as any);
	};

	return (
		<div
			ref={nodeRef}
			className={`${styles.draggable} ${styles.win95Card}`}
			style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
		>
			<div className={styles.cardTitlebar} onPointerDown={onPointerDown}>
				<span className={styles.cardTitleText}>Media Player</span>
				<div className={styles.cardControls}>
					<button className={`${styles.cardBtn} ${styles.cardBtnMin}`} aria-label="minimize"></button>
					<button className={`${styles.cardBtn} ${styles.cardBtnMax}`} aria-label="maximize"></button>
					<button className={`${styles.cardBtn} ${styles.cardBtnClose}`} aria-label="close"></button>
				</div>
			</div>
			<div className={styles.cardMenubar}>
				<span className={styles.menuItem}>File</span>
				<span className={styles.menuItem}>Play</span>
				<span className={styles.menuItem}>Options</span>
			</div>
			<div className={styles.cardBody}>
				<div className={styles.playerDisplay}>
					<span className={styles.trackName}>Track_01.wav</span>
					<span className={styles.trackTime}>00:42 / 03:17</span>
				</div>
				<div className={styles.playerProgress}>
					<div className={styles.progressFill}></div>
					<div className={styles.progressThumb}></div>
				</div>
				<div className={styles.playerControls}>
					<button className={`${styles.ctrlBtn} ${styles.ctrlPrev}`} aria-label="previous"></button>
					<button className={`${styles.ctrlBtn} ${styles.ctrlPlay}`} aria-label="play"></button>
					<button className={`${styles.ctrlBtn} ${styles.ctrlStop}`} aria-label="stop"></button>
					<button className={`${styles.ctrlBtn} ${styles.ctrlNext}`} aria-label="next"></button>
				</div>
			</div>
			<div className={styles.cardStatusbar}>
				<span className={styles.statusText}>Playing</span>
				<span className={styles.statusVol}>Vol: 75%</span>
			</div>
		</div>
	);
}
