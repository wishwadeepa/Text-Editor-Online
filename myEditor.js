document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('textEditor');
    let savedSelection = null; 

    const updatePlaceholderState = () => {
        if (editor.textContent.trim() === '' && !editor.querySelector('img')) { 
            editor.classList.add('placeholder-active');
        } else {
            editor.classList.remove('placeholder-active');
        }
    };

    const saveSelection = () => {
        if (window.getSelection) {
            const sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                const range = sel.getRangeAt(0);
                if (editor.contains(range.commonAncestorContainer) || range.commonAncestorContainer === editor) {
                    savedSelection = range;
                } else {
                    savedSelection = null; 
                }
            } else {
                savedSelection = null;
            }
        } else if (document.selection && document.selection.createRange) { 
            savedSelection = document.selection.createRange();
        } else {
            savedSelection = null;
        }
    };

    const restoreSelection = () => {
        if (savedSelection) {
            if (window.getSelection) {
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(savedSelection);
            } else if (document.selection && savedSelection.select) { 
                savedSelection.select();
            }
        }
    };

    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value);
        editor.focus(); 
        updatePlaceholderState(); 
    };

    editor.addEventListener('focus', () => {
        editor.classList.remove('placeholder-active');
    });

    editor.addEventListener('blur', () => {
        updatePlaceholderState();
    });

    editor.addEventListener('input', () => {
        updatePlaceholderState();
    });

    updatePlaceholderState();


    document.getElementById('boldBtn').addEventListener('click', () => execCmd('bold'));
    document.getElementById('underlineBtn').addEventListener('click', () => execCmd('underline'));
    document.getElementById('italicBtn').addEventListener('click', () => execCmd('italic'));

    const fontColorWrapper = document.getElementById('fontColorWrapper');
    const fontColorInput = document.getElementById('fontColorInput');

    fontColorWrapper.addEventListener('mousedown', () => {
        if (editor === document.activeElement || editor.contains(document.activeElement)) {
            saveSelection();
        }
    });
    
    fontColorInput.addEventListener('mousedown', () => {
        if (editor === document.activeElement || editor.contains(document.activeElement)) {
            saveSelection();
        }
    });

    fontColorWrapper.addEventListener('click', (e) => {
        if (e.target === fontColorWrapper || e.target.classList.contains('color-picker-label')) {
            if (!savedSelection && (editor === document.activeElement || editor.contains(document.activeElement))) {
                 saveSelection();
            }
            fontColorInput.click(); 
        }
    });

    fontColorInput.addEventListener('change', (e) => {
        if (savedSelection) {
            restoreSelection(); 
        } else {
            editor.focus(); 
        }
        document.execCommand('foreColor', false, e.target.value);
        editor.focus(); 
        savedSelection = null; 
        updatePlaceholderState(); 
    });

    const alignButtons = ['alignLeftBtn', 'alignCenterBtn', 'alignRightBtn', 'alignJustifyBtn'];
    const textAlignValues = ['left', 'center', 'right', 'justify'];

    alignButtons.forEach((btnId, index) => {
        document.getElementById(btnId).addEventListener('click', () => {
            editor.style.textAlign = textAlignValues[index];
            editor.focus();
        });
    });
    
    document.getElementById('undoBtn').addEventListener('click', () => execCmd('undo'));
    document.getElementById('redoBtn').addEventListener('click', () => execCmd('redo'));

});