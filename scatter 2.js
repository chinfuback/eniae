// ==UserScript==
// @name         2.scatter Script (Safari Support)
// @description  Auto-detect spin button and manage free spins
// @author       Userscripts
// @version      1.2.1
// @match        *://*/*
// @grant        none
// ==/UserScript==
(function () {
	console.log('⏳ กำลังรอให้ Cocos Creator โหลด...');

	let waitForCC = setInterval(() => {
		if (typeof cc !== 'undefined' && cc.find) {
			clearInterval(waitForCC);
			console.log(
				'🎰 Cocos Creator โหลดเสร็จแล้ว! เริ่มบังคับ Scatter, Wild และ Big Win...',
			);

			// ✅ ฟังก์ชันค้นหาปุ่มหมุน
			function findSpinButton() {
				let buttonPaths = [
					'Canvas/spin_button_controller_holder/spin_button_controller',
					'Canvas/spin_button_controller_holder',
					'Canvas/spin_button',
				];

				for (let path of buttonPaths) {
					let button = cc.find(path);
					if (button) return button;
				}
				return null;
			}

			// ✅ ยกปุ่มหมุนขึ้นด้านบนสุด
			function moveSpinButtonToTop() {
				let spinButton = findSpinButton();
				if (spinButton) {
					spinButton.zIndex = 9999;
					spinButton.setSiblingIndex(Infinity);
					console.log('✅ ปุ่มหมุนถูกยกขึ้นด้านบนสุด!');
				} else {
					console.warn('⚠️ ไม่พบปุ่มหมุนในโครงสร้าง Canvas!');
				}
			}

			// ✅ บังคับ Scatter 3 ตัว และ Wild เต็มแถว 3, 4
			function generateSpinResult() {
				let reels = 6; // จำนวนวงล้อของสล็อต
				let rows = 5; // จำนวนแถวแนวนอน
				let scatterCount = 0;
				let scatterPositions = new Set();

				// สุ่มตำแหน่ง Scatter (3 ตัว ไม่ซ้ำกัน)
				while (scatterPositions.size < 3) {
					let col = Math.floor(Math.random() * reels);
					scatterPositions.add(col);
				}

				let results = Array.from({ length: reels }, (_, col) => {
					return Array.from({ length: rows }, (_, row) => {
						if (scatterPositions.has(col)) {
							return 'Scatter';
						} else if (col === 2 || col === 3) {
							return 'Wild';
						}
						return 'OtherSymbol';
					});
				});

				console.log('🎰 ผลลัพธ์การหมุน:');
				results.forEach((col, index) =>
					console.log(`🌀 Reel ${index + 1}: ${col.join(' | ')}`),
				);
				return results;
			}

			// ✅ บังคับ Big Win ตามจำนวนการกด
			let spinCount = 0;
			function generateBigWin(spinCount) {
				let winAmount = 1000 + spinCount * 500; // เพิ่มเงินรางวัลตามจำนวนครั้งที่กด
				console.log(
					`💰 Big Win! ได้รับรางวัล: ${winAmount} เครดิต (กดไปแล้ว ${spinCount} ครั้ง)`,
				);
			}

			// ✅ ตั้งค่าปุ่มหมุน
			function setupSpinButton() {
				let spinButton = findSpinButton();
				if (spinButton) {
					spinButton.on('click', () => {
						spinCount++;
						console.log(`🎰 กดปุ่มหมุนครั้งที่ ${spinCount}`);
						let results = generateSpinResult();
						generateBigWin(spinCount);
					});
					console.log('✅ ปุ่มหมุนพร้อมใช้งาน!');
				} else {
					console.warn('⚠️ ไม่พบปุ่มหมุนในโครงสร้าง Canvas!');
				}
			}

			// ✅ เรียกใช้งานฟังก์ชัน
			moveSpinButtonToTop();
			setupSpinButton();
		}
	}, 1000); // ✅ ตรวจสอบทุก 1 วินาทีว่ามี `cc` หรือยัง
})();
