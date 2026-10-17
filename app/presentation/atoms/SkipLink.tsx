"use client";

const skipLinkCss = `
  .skipLink {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  .skipLink:focus-visible {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 50;
    width: auto;
    height: auto;
    margin: 0;
    padding: 0.75rem 1rem;
    overflow: visible;
    clip-path: none;
    white-space: normal;
    background: var(--accent);
    color: var(--foreground);
    border-radius: 0.375rem;
    font-weight: 600;
  }
`;

export function SkipLink() {
  return (
    <>
      <style>{skipLinkCss}</style>
      <a
        className="skipLink"
        href="#content"
        onClick={(event) => {
          const target = document.getElementById("content");
          if (!target) {
            return;
          }

          event.preventDefault();
          target.focus();
        }}
      >
        Skip to content
      </a>
    </>
  );
}
