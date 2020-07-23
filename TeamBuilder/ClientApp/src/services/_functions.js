import { store } from "../index";
import * as Alerts from "../panels/components/Alerts.js";

export const smoothScrollToTop = () => {
	const c = document.documentElement.scrollTop || document.body.scrollTop;

	if (c > 30) {
		return;
	}

	if (c > 0) {
		window.requestAnimationFrame(smoothScrollToTop);
		window.scrollTo(0, c - c / 8);
	}
};

export const restoreScrollPosition = () => {
	let scrolls = store.getState().vkui.componentScroll;

	Object.keys(scrolls).forEach((component) => {
		let componentData = scrolls[component];

		let element = document.getElementById(component);

		if (element) {
			element = element.getElementsByClassName("HorizontalScroll__in")[0];

			element.scrollLeft = componentData.x;
			element.scrollTop = componentData.y;
		}
	});
};

export const getActivePanel = (view) => {
	let panel = store.getState().router.activePanel;

	let panelsHistory = store.getState().router.panelsHistory;
	if (typeof panelsHistory[view] !== "undefined") {
		panel = panelsHistory[view][panelsHistory[view].length - 1];
	}

	let separatorIndex = panel.indexOf('_');
	if (separatorIndex !== -1) {
		return {
			panel: panel.substring(0, separatorIndex),
			itemId: panel.substring(++separatorIndex)
		}
	}

	return { panel };
};

// /**
//  * [longOperationHandler Блокирует экран на время выполнения action]
//  * @param  {[type]} arg1 [description]
//  * @param  {[type]} arg2 [description]
//  * @return {[type]}      [description]
//  */
// export const longOperationHandler = async (e, action, alert, afterAction) => {
// 	e.stopPropagation();

// 	let handler = async () => {
// 		Alerts.BlockScreen();
// 		await action();
// 		Alerts.UnblockScreen();
// 		afterAction && await afterAction();
// 	};

// 	if (alert) {
// 		alert(handler);
// 	}
// 	else {
// 		await handler();
// 	}
// }

//action, preAction, postAction
export const longOperationWrapper = async (longOperation) => {
	longOperation.preAction && await longOperation.preAction();

	Alerts.BlockScreen();
	longOperation.action && await longOperation.action();
	Alerts.UnblockScreen();

	longOperation.postAction && await longOperation.postAction();
}

