const fontSelector = document.getElementById('selectedFont');
const fontPreview = document.getElementById('fontPreview');

fontSelector.addEventListener('change', () => {
    const selectedFont = fontSelector.value;
    console.info({ selectedFont });
    fontPreview.style.fontFamily = `'${selectedFont}'`;
});
