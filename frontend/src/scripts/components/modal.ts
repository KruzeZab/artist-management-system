interface ModalOptions {
  id: string;
  title: string;
  content: string;
  actions: string;
  onClose?: () => void;
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

    this.setTitle(this.options.title);
    this.setContent(this.options.content);
    this.setActions(this.options.actions);
  }

  private initializeEventListeners() {
    if (this.closeButtonElement) {
      this.closeButtonElement.addEventListener('click', () => {
        this.hide();

        if (this.options.onClose) {
          this.options.onClose();
        }
      });
    }

    window.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.hide();
        if (this.options.onClose) {
          this.options.onClose();
        }
      }
    });
  }

  public show() {
    this.modal.style.display = 'flex';
  }

  public hide() {
    this.modal.style.display = 'none';
  }

  public setTitle(title: string) {
    const modalTitle = this.modal.querySelector('.modal__header-title');
    if (modalTitle) {
      modalTitle.innerHTML = title;
    }
  }

  public setContent(content: string) {
    const modalBody = this.modal.querySelector('.modal__body');
    if (modalBody) {
      modalBody.innerHTML = content;
    }
  }

  public setActions(buttons: string) {
    const modalFooter = this.modal.querySelector('.modal__footer');
    if (modalFooter) {
      modalFooter.innerHTML = buttons;
    }
  }
}

export default Modal;
