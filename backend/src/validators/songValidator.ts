import { Genre, Song, UpdateSong } from '../interfaces/song';
import { validateProperties } from '../utils/object';

/**
 * Validate the body of song registration
 *
 */
export function validateSongRegister(song: Song) {
  const errors: string[] = [];

  const allowedKeys = Object.keys({} as Song) as (keyof Song)[];

  // Validate extra properties
  errors.push(...validateProperties(song, allowedKeys));

  if (!song.title || !song.title.trim()) {
    errors.push('Song title is required');
  }

  if (song.title && song.title.length < 4) {
    errors.push('Song title imust be at least 4 characters long');
  }

  if (!song.albumName || !song.albumName.trim()) {
    errors.push('Album name is required');
  }

  if (song.albumName && song.albumName.length < 4) {
    errors.push('Song Album Name imust be at least 4 characters long');
  }

  if (!song.genre || !song.genre.trim()) {
    errors.push('Genre is required');
  }

  if (song.genre && !Object.values(Genre).includes(song.genre)) {
    errors.push('Invalid genre.');
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
}

/**
 * Validate song update
 *
 */
export function validateSongUpdate(song: UpdateSong) {
  const errors: string[] = [];

  const allowedKeys = Object.keys({} as UpdateSong) as (keyof UpdateSong)[];

  // Validate extra properties
  errors.push(...validateProperties(song, allowedKeys));

  if (song.title && song.title.length < 4) {
    errors.push('Song title imust be at least 4 characters long');
  }

  if (song.albumName && song.albumName.length < 4) {
    errors.push('Song Album Name imust be at least 4 characters long');
  }

  if (song.genre && !Object.values(Genre).includes(song.genre)) {
    errors.push('Invalid genre.');
  }

  return errors.length > 0 ? { success: false, errors } : { success: true };
}
