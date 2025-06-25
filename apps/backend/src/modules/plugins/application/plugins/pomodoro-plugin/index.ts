import { Plugin } from '@/modules/plugins/domain';

const DEFAULT_POMODORO_STATE = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesForLongBreak: 4,
  discordAutoMute: true,
};

export class PomodoroPlugin extends Plugin {
  id = 'pomodoro-plugin';
  bootstrap: Plugin['bootstrap'] = async () => {
    this.log('Initialized');
  };
  onRoomStarted: Plugin['onRoomStarted'] = async (room) => {
    this.log(`Starting for room ${room.roomId}`);
    this.saveState(room.roomId, { ...DEFAULT_POMODORO_STATE });
    this.broadcastToRoom(room.roomId, 'pomodoro.stateUpdate', { ...DEFAULT_POMODORO_STATE });
  };
  onRoomStopped: Plugin['onRoomStopped'] = async (room) => {
    this.log(`Stopping for room ${room.roomId}`);
    // Optionally, you can clear the state or perform cleanup here
    this.saveState(room.roomId, {});
    this.broadcastToRoom(room.roomId, 'pomodoro.stateUpdate', {});
  };
  onMemberJoined: Plugin['onMemberJoined'] = async (room, memberId) => {
    this.log(`Member ${memberId} joined room ${room.roomId}`);
  };
  onMemberLeft: Plugin['onMemberLeft'] = async (room, memberId) => {
    this.log(`Member ${memberId} left room ${room.roomId}`);
  };
  onClientEvent: Plugin['onClientEvent'] = async (roomId, memberId, event, data) => {
    const room = this.api.getRoom(roomId);
    if (!room || !room.hasMember(memberId)) {
      this.log(`Member ${memberId} not found in room ${roomId}`);
      return;
    }
  };
}
