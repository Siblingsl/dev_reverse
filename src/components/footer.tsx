"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");

  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  const openModal = (type: "privacy" | "disclaimer" | "about") => {
    if (type === "disclaimer") {
      setModalContent({
        title: t("modals.disclaimer.title"),
        content: (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="rounded-md bg-red-50 p-3 text-red-600 dark:bg-red-950/30 dark:text-red-400 font-bold">
              {t("modals.disclaimer.alert")}
            </p>
            {/* 使用 t.rich 支持 HTML 标签 */}
            <p>
              {t.rich("modals.disclaimer.p1", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("modals.disclaimer.p2", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("modals.disclaimer.p3", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("modals.disclaimer.p4", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("modals.disclaimer.p5", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
        ),
      });
    } else if (type === "privacy") {
      setModalContent({
        title: t("modals.privacy.title"),
        content: (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              {t.rich("modals.privacy.local", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("modals.privacy.cloud", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>
              {t.rich("modals.privacy.warning", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
        ),
      });
    } else {
      setModalContent({
        title: t("modals.about.title"),
        content: (
          <div className="text-sm text-muted-foreground">
            <p>{t("modals.about.desc")}</p>
            <p className="mt-2">{t("modals.about.contact")}</p>
          </div>
        ),
      });
    }
  };

  return (
    <>
      <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground mt-auto">
        <div className="mb-4 flex justify-center gap-6">
          <button
            onClick={() => openModal("disclaimer")}
            className="hover:text-blue-600 hover:underline"
          >
            {t("links.disclaimer")}
          </button>
          <button
            onClick={() => openModal("privacy")}
            className="hover:text-blue-600 hover:underline"
          >
            {t("links.privacy")}
          </button>
          <button
            onClick={() => openModal("about")}
            className="hover:text-blue-600 hover:underline"
          >
            {t("links.about")}
          </button>
        </div>
        <div>{t("copyright")}</div>
        <div className="mt-2 opacity-70 text-xs">{t("agreement")}</div>
      </footer>

      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-slate-900 p-6 shadow-xl transform transition-all scale-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="mb-6 leading-relaxed">{modalContent.content}</div>
            <button
              onClick={() => setModalContent(null)}
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("modals.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
