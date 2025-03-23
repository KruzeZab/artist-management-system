import config from '../../config';

import { GET } from '../../constants/methods';

import { Song } from '../../interface/song';
import { SongListResponse } from '../../interface/response';

import { fetchAPI } from '../utils/fetch';
import { buildUrl, interpolate } from '../utils/url';
import { getFullName } from './user';

/**
 * Fetches songs from the server based on the provided page and limit.
 *
 */
export async function getSongs(page: number, limit: number, artistId?: number) {
  if (!artistId) {
    return null;
  }

  const queryParams: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
    artistId: artistId.toString(),
  };

  const songsUrl = buildUrl(
    config.serverUrl,
    interpolate(config.endpoints.songs, { artistId }),
    queryParams,
  );

  try {
    const { data, meta } = await fetchAPI<SongListResponse>(
      songsUrl,
      GET,
      null,
      true,
    );

    return { songs: data, totalRecords: meta?.totalRecords ?? 0 };
  } catch (error) {
    console.error('Error fetching songs:', error);
    return null;
  }
}

/**
 * Updates the songs table and pagination buttons based on the fetched user data.
 *
 */
export function updateSongsTable(
  page: number,
  limit: number,
  songs: Song[],
  totalRecords: number,
  songTable: HTMLElement,
  prevButton: HTMLButtonElement,
  nextButton: HTMLButtonElement,
) {
  songTable.innerHTML = '';

  if (!songs || !songs.length) {
    songTable.innerHTML =
      '<td colspan="8" class="table-empty">No songs found.</td>';
    prevButton.classList.add('d-none');
    nextButton.classList.add('d-none');
    return;
  }

  songs.forEach((song, index) => {
    const row = document.createElement('tr');
    const songDetailLink = `/src/pages/song-detail.html?songId=${song.id}&artistId=${song.artistId}`;
    row.innerHTML = `
      <td>${(page - 1) * limit + index + 1}</td>
      <td><a href="${songDetailLink}">${song.title}</a></td>
      <td>${song.albumName}</td>
      <td>${song.genre}</td>
       <td><a href="/src/pages/artist-detail.html?id=${song.artistId}" class="view-btn">${getFullName(song.artistFirstName, song.artistLastName)}</a></td>
      <td><a href="/src/pages/song-detail.html?songId=${song.id}&artistId=${song.artistId}" class="view-btn">View Detail</a></td>
    `;
    songTable.appendChild(row);
  });

  const isPrevBtnDisabled = page <= 1;
  const isNextBtnDisabled = page * limit >= totalRecords;

  if (isNextBtnDisabled) {
    nextButton.classList.add('d-none');
  }

  if (isPrevBtnDisabled) {
    prevButton.classList.add('d-none');
  }
}
