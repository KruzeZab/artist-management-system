interface ModalOptions {
  id: string;
  onClose: () => void;
  content?: string;
}

class Modal {
  private modal: HTMLElement;
  private closeButtonElement: HTMLElement | null;
  private options: ModalOptions;

  constructor(options: ModalOptions) {
    this.options = options;
    this.modal = document.getElementById(this.options.id) as HTMLElement;

    if (!this.modal) {
      throw new Error(`Modal with id "${this.options.id}" not found.`);
    }

    this.closeButtonElement = this.modal.querySelector('.modal__close');

    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    if (this.closeButtonElement) {
      this.closeButtonElement.addEventListener('click', () => {
        this.hide();
        this.options.onClose();
      });
    }

    window.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.hide();
        this.options.onClose();
      }
    });
  }

  public show(): void {
    this.modal.style.display = 'flex';
  }

  public hide(): void {
    this.modal.style.display = 'none';
  }

  public setContent(content: string): void {
    const modalBody = this.modal.querySelector('.modal__body');
    if (modalBody) {
      modalBody.innerHTML = content;
    }
  }
}

export default Modal;
