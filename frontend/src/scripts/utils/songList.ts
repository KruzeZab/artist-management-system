import config from '../../config';

import { GET } from '../../constants/methods';

import { Song } from '../../interface/song';
import { SongListResponse } from '../../interface/response';

import { fetchAPI } from '../utils/fetch';
import { buildUrl, interpolate } from '../utils/url';

/**
 * Fetches songs from the server based on the provided page and limit.
 *
 */
export async function getSongs(page: number, limit: number, artistId: number) {
  const songsUrl = buildUrl(
    config.serverUrl,
    interpolate(config.endpoints.songs, { artistId }),
    {
      page: page.toString(),
      limit: limit.toString(),
      artistId: artistId.toString(),
    },
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
    prevButton.disabled = true;
    nextButton.disabled = true;
    return;
  }

  songs.forEach((song, index) => {
    const row = document.createElement('tr');
    const songDetailLink = `/src/pages/song-detail.html?id=${song.id}`;
    row.innerHTML = `
      <td>${(page - 1) * limit + index + 1}</td>
      <td><a href="${songDetailLink}">${song.title}</a></td>
      <td>${song.albumName}</td>
      <td>${song.genre}</td>
    `;
    songTable.appendChild(row);
  });

  prevButton.disabled = page <= 1;
  nextButton.disabled = page * limit >= totalRecords;
}
