export interface GamepadInputState {
  left: boolean;
  right: boolean;
  angleUp: boolean;
  angleDown: boolean;
  fire: boolean;
  ability: boolean;
  pause: boolean;
}

type GamepadInputCallback = (state: GamepadInputState) => void;

const DEADZONE = 0.3;

export class GamepadManager {
  private connected = false;
  private index: number | null = null;
  private prevState: GamepadInputState = this.emptyState();
  private listeners: GamepadInputCallback[] = [];
  private animFrame: number | null = null;

  constructor() {
    if (typeof window === 'undefined') return;

    window.addEventListener('gamepadconnected', (e) => {
      if (!this.connected) {
        this.connected = true;
        this.index = e.gamepad.index;
        this.startPolling();
      }
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      if (e.gamepad.index === this.index) {
        this.connected = false;
        this.index = null;
        this.stopPolling();
      }
    });
  }

  private emptyState(): GamepadInputState {
    return { left: false, right: false, angleUp: false, angleDown: false, fire: false, ability: false, pause: false };
  }

  private startPolling(): void {
    const poll = () => {
      this.poll();
      this.animFrame = requestAnimationFrame(poll);
    };
    this.animFrame = requestAnimationFrame(poll);
  }

  private stopPolling(): void {
    if (this.animFrame !== null) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  }

  private poll(): void {
    if (!this.connected || this.index === null) return;
    const gamepads = navigator.getGamepads();
    const gp = gamepads[this.index];
    if (!gp) return;

    const state: GamepadInputState = {
      left: this.isPressed(gp, 14) || this.getAxis(gp, 0) < -DEADZONE,
      right: this.isPressed(gp, 15) || this.getAxis(gp, 0) > DEADZONE,
      angleUp: this.isPressed(gp, 12) || this.getAxis(gp, 1) < -DEADZONE,
      angleDown: this.isPressed(gp, 13) || this.getAxis(gp, 1) > DEADZONE,
      fire: this.isPressed(gp, 0) || this.isPressed(gp, 7),
      ability: this.isPressed(gp, 2) || this.isPressed(gp, 3),
      pause: this.isPressed(gp, 9),
    };

    const changed =
      state.left !== this.prevState.left ||
      state.right !== this.prevState.right ||
      state.angleUp !== this.prevState.angleUp ||
      state.angleDown !== this.prevState.angleDown ||
      state.fire !== this.prevState.fire ||
      state.ability !== this.prevState.ability ||
      state.pause !== this.prevState.pause;

    if (changed) {
      this.prevState = state;
      this.listeners.forEach(cb => cb(state));
    }
  }

  private isPressed(gp: Gamepad, buttonIndex: number): boolean {
    const btn = gp.buttons[buttonIndex];
    return btn ? btn.pressed || btn.value > DEADZONE : false;
  }

  private getAxis(gp: Gamepad, axisIndex: number): number {
    return gp.axes[axisIndex] ?? 0;
  }

  onInput(callback: GamepadInputCallback): () => void {
    this.listeners.push(callback);
    return () => {
      const idx = this.listeners.indexOf(callback);
      if (idx > -1) this.listeners.splice(idx, 1);
    };
  }

  isConnected(): boolean {
    return this.connected;
  }

  destroy(): void {
    this.stopPolling();
    this.listeners = [];
    this.connected = false;
    this.index = null;
  }
}
