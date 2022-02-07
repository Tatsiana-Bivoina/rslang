export default class SprintController {
  // constructor() {
  //   this.toggleFullScreen();
  // }

  async toggleFullScreen() {
    const btnFullScreen: HTMLElement | null = document.querySelector('.btn-fullscreen');
    btnFullScreen?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
    console.log(btnFullScreen);
  }
}
