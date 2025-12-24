import { useEffect } from 'react';

interface HighlighterProps {
trigger?: unknown;
}

const Highlighter = ({ trigger }: HighlighterProps) => {
useEffect(() => {
    const highlightWord = (word: string, highlightColor: string = '#0000', caseSensitive: boolean = false): number => {
    const removeHighlights = () => {
        const marks = document.querySelectorAll('.highlighter-mark');
        marks.forEach((mark) => {
        const parent = mark.parentNode;
        if (parent) {
            parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
            parent.normalize();
        }
        });
    };

    removeHighlights();

    if (!word.trim()) return 0;

    const body = document.body;
    const walker = document.createTreeWalker(
        body,
        NodeFilter.SHOW_TEXT,
        {
        acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            
            const tagName = parent.tagName.toLowerCase();
            if (['script', 'style', 'noscript'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
            }
            
            if (parent.classList.contains('highlighter-mark')) {
            return NodeFilter.FILTER_REJECT;
            }

            return NodeFilter.FILTER_ACCEPT;
        },
        }
    );

    const nodesToHighlight: { node: Text; matches: RegExpMatchArray[] }[] = [];
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);

    let node: Node | null;
    while ((node = walker.nextNode())) {
        const textNode = node as Text;
        const matches = [...textNode.textContent!.matchAll(regex)];
        if (matches.length > 0) {
        nodesToHighlight.push({ node: textNode, matches });
        }
    }

    let totalMatches = 0;
    nodesToHighlight.forEach(({ node, matches }) => {
        const text = node.textContent!;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        matches.forEach((match) => {
        const index = match.index!;
        
        if (index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
        }

        const mark = document.createElement('mark');
        mark.className = 'highlighter-mark';
        mark.style.backgroundColor = highlightColor;
        mark.style.padding = '2px 0';
        mark.style.borderRadius = '2px';
        mark.style.fontWeight = 'bold';
        mark.textContent = match[0];
        fragment.appendChild(mark);

        lastIndex = index + match[0].length;
        totalMatches++;
        });

        if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        node.parentNode?.replaceChild(fragment, node);
    });

    return totalMatches;
    };

    // Highlight the word "not"
    highlightWord('not');

    // Cleanup function to remove highlights when component unmounts
    return () => {
    const marks = document.querySelectorAll('.highlighter-mark');
    marks.forEach((mark) => {
        const parent = mark.parentNode;
        if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize();
        }
    });
    };
}, [trigger]);

return null;
};

export default Highlighter;