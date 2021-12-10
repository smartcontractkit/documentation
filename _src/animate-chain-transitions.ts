document.addEventListener('DOMContentLoaded', () => {
    const faders: HTMLDivElement[] = [];
    document.querySelectorAll<HTMLDivElement>('.fader').forEach(element => {
        faders.push(element);
    });
    // Setup any faders on the page
    for(let fader of faders) {
        // Setup to only show first one
        (<HTMLElement>fader.children[0]).style.opacity = '1';
        for(let i = 1;i<fader.children.length;i++) {
            (<HTMLElement>fader.children[i]).style.opacity = '0';
        }

        // Fade the current to the next every interval
        let currentFader = 0;
    
        setInterval(() => {
            let nextFader = currentFader + 1;
            if(nextFader >= fader.children.length) {
                nextFader = 0;
            }
            (<HTMLElement>fader.children[currentFader]).style.opacity = '0';
            (<HTMLElement>fader.children[nextFader]).style.opacity = '1';
            currentFader = nextFader;
        }, 5000);
    }
    
});