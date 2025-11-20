import { useState, useCallback } from "react";

const SMARTLINK_URL = "https://www.effectivegatecpm.com/uf4hx791f?key=95ad2f2d7ede996ba864dd8afeafef89";

export function useSmartAd() {
  // 记录本次操作是否已经弹过广告
  const [hasOpenedAd, setHasOpenedAd] = useState(false);

  // 重置广告状态（通常在上传新文件、开始新任务时调用）
  const resetAdStatus = useCallback(() => {
    setHasOpenedAd(false);
  }, []);

  // 尝试触发广告（通常在下载、复制操作前调用）
  // 返回值：无。它只负责副作用（弹窗）
  const triggerAd = useCallback(() => {
    if (!hasOpenedAd) {
      window.open(SMARTLINK_URL, "_blank");
      setHasOpenedAd(true); // 🔒 上锁
    }
  }, [hasOpenedAd]);

  return {
    resetAdStatus,
    triggerAd,
    hasOpenedAd // 把状态也露出来，如果外层点击事件需要判断
  };
}