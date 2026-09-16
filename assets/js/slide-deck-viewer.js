(function () {
  const PDFJS_VERSION = "4.10.38";
  const PDFJS_BASE = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build`;

  function initViewer(root) {
    const pdfUrl = root.dataset.pdfUrl;
    const canvas = root.querySelector("[data-canvas]");
    const stage = root.querySelector("[data-stage]");
    const statusEl = root.querySelector("[data-status]");
    const pageLabel = root.querySelector("[data-page-label]");
    const prevBtn = root.querySelector('[data-action="prev"]');
    const nextBtn = root.querySelector('[data-action="next"]');
    const fullscreenBtn = root.querySelector('[data-action="fullscreen"]');

    if (!pdfUrl || !canvas || !stage) return;

    const ctx = canvas.getContext("2d");
    let pdfDoc = null;
    let pageNum = 1;
    let rendering = false;
    let pendingPage = null;

    function isStageFullscreen() {
      return document.fullscreenElement === stage;
    }

    function setStatus(message, isError) {
      if (!statusEl) return;
      statusEl.textContent = message || "";
      statusEl.hidden = !message;
      statusEl.classList.toggle("slide-deck-viewer__status--error", Boolean(isError));
    }

    function updateControls() {
      const total = pdfDoc ? pdfDoc.numPages : 0;
      if (pageLabel) {
        pageLabel.textContent = total ? `${pageNum} / ${total}` : "—";
      }
      if (prevBtn) prevBtn.disabled = !total || pageNum <= 1;
      if (nextBtn) nextBtn.disabled = !total || pageNum >= total;
      if (fullscreenBtn) {
        fullscreenBtn.textContent = isStageFullscreen() ? "Exit" : "Fullscreen";
      }
    }

    function stageInnerSize() {
      const style = getComputedStyle(stage);
      const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const padY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      return {
        width: Math.max(stage.clientWidth - padX, 1),
        height: Math.max(stage.clientHeight - padY, 1),
      };
    }

    function renderPage(num) {
      if (!pdfDoc) return;
      rendering = true;
      setStatus("");

      pdfDoc
        .getPage(num)
        .then(function (page) {
          const { width: availW, height: availH } = stageInnerSize();
          const unscaled = page.getViewport({ scale: 1 });
          const scaleW = availW / unscaled.width;
          const scaleH = availH / unscaled.height;
          const fullscreen = isStageFullscreen();
          const scale = fullscreen ? Math.min(scaleW, scaleH) * 0.98 : scaleW;
          const viewport = page.getViewport({ scale: scale });

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          canvas.style.maxWidth = "100%";
          canvas.style.maxHeight = fullscreen ? "100%" : "none";

          const renderTask = page.render({ canvasContext: ctx, viewport: viewport });
          return renderTask.promise;
        })
        .then(function () {
          rendering = false;
          updateControls();
          if (pendingPage !== null) {
            const next = pendingPage;
            pendingPage = null;
            pageNum = next;
            renderPage(pageNum);
          }
        })
        .catch(function (err) {
          rendering = false;
          setStatus("Could not render this slide. Try downloading the PDF.", true);
          console.error(err);
        });
    }

    function queueRenderPage(num) {
      if (rendering) {
        pendingPage = num;
        return;
      }
      pageNum = num;
      renderPage(pageNum);
    }

    function goPrev() {
      if (!pdfDoc || pageNum <= 1) return;
      queueRenderPage(pageNum - 1);
    }

    function goNext() {
      if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
      queueRenderPage(pageNum + 1);
    }

    function scheduleRender() {
      requestAnimationFrame(function () {
        if (pdfDoc) renderPage(pageNum);
      });
    }

    prevBtn && prevBtn.addEventListener("click", goPrev);
    nextBtn && nextBtn.addEventListener("click", goNext);

    fullscreenBtn &&
      fullscreenBtn.addEventListener("click", function () {
        if (!document.fullscreenElement) {
          stage.requestFullscreen && stage.requestFullscreen();
        } else {
          document.exitFullscreen && document.exitFullscreen();
        }
      });

    document.addEventListener("fullscreenchange", function () {
      stage.classList.toggle("slide-deck-viewer__stage--fullscreen", isStageFullscreen());
      updateControls();
      scheduleRender();
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Escape" && isStageFullscreen()) {
        document.exitFullscreen && document.exitFullscreen();
      }
    });

    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(scheduleRender, 150);
    });

    setStatus("Loading slides…");

    import(`${PDFJS_BASE}/pdf.mjs`)
      .then(function (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/pdf.worker.mjs`;
        return pdfjsLib.getDocument(pdfUrl).promise;
      })
      .then(function (doc) {
        pdfDoc = doc;
        setStatus("");
        updateControls();
        renderPage(1);
      })
      .catch(function (err) {
        setStatus("Could not load the slide deck. Try the download link below.", true);
        console.error(err);
      });
  }

  function boot() {
    document.querySelectorAll(".slide-deck-viewer").forEach(initViewer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
