import config from '../../config';

import { GET } from '../../constants/methods';

import { ArtistListResponse } from '../../interface/response';

import { mapGender } from './user';

import { buildUrl } from '../utils/url';
import { fetchAPI } from '../utils/fetch';
import { Artist } from '../../interface/artist';

/**
 * Fetches artists from the server based on the provided page and limit.
 *
 */
export async function getArtists(page: number, limit: number) {
  const artistsUrl = buildUrl(config.serverUrl, config.endpoints.artists, {
    page: page.toString(),
    limit: limit.toString(),
  });

  try {
    const { data, meta } = await fetchAPI<ArtistListResponse>(
      artistsUrl,
      GET,
      null,
      true,
    );
    return { artists: data, totalRecords: meta?.totalRecords ?? 0 };
  } catch (error) {
    console.error('Error fetching artists:', error);
    return null;
  }
}

/**
 * Updates the artist table and pagination buttons based on the fetched artist data.
 *
 */
export function updateArtistTable(
  page: number,
  limit: number,
  artists: Artist[],
  totalRecords: number,
  artistTable: HTMLElement,
  prevButton: HTMLButtonElement,
  nextButton: HTMLButtonElement,
) {
  artistTable.innerHTML = '';

  if (!artists || !artists.length) {
    artistTable.innerHTML =
      '<td colspan="8" class="table-empty">No artists found.</td>';
    prevButton.disabled = true;
    nextButton.disabled = true;
    return;
  }

  artists.forEach((artist, index) => {
    const row = document.createElement('tr');
    const artistDetailLink = `/src/pages/artist-detail.html?id=${artist.id}`;
    row.innerHTML = `
      <td>${(page - 1) * limit + index + 1}</td>
      <td><a href="${artistDetailLink}">${artist.name}</a></td>
      <td>${mapGender(artist.gender)}</td>
      <td>${artist.dob}</td>
      <td>${artist.address}</td>
      <td>${artist.firstReleaseYear}</td>
      <td>${artist.noOfAlbumsReleased}</td>
    `;
    artistTable.appendChild(row);
  });

  prevButton.disabled = page <= 1;
  nextButton.disabled = page * limit >= totalRecords;
}
