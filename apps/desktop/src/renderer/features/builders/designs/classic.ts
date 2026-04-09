import type { DesignDefinitionType } from '../types';

export const classic: DesignDefinitionType = {
  id: 'classic',
  label: 'Classic',
  css: `
    .resume-root {
      font-family: Arial, sans-serif;
      color: #000000;
      font-size: 11pt;
      line-height: 1.2;
    }

    .resume-page {
      background: white;
      box-sizing: border-box;
    }

    .resume-header {}

    .resume-name {
      font-family: Areal, sans-serif;
      font-size: 11pt;
      font-weight: 600;
      color: #000000;
      line-height: 1.2;
      text-align: center;
    }

    .resume-contact {
      font-size: 11pt;
      line-height: 1.2;
      color: #000000;
      justify-content: center;
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      text-align: center;
    }

    .resume-contact-item + .resume-contact-item::before {
      content: " • ";
      white-space: pre;
    }

    .resume-summary {
      padding-top: calc(13.2pt * var(--spacing-multiplier, 1));
      font-size: 11pt;
      color: #000000;
      margin: 0;
      line-height: 1.2;
    }

    .resume-divider {
      display: none;
    }

    .resume-section {}

    .resume-section-heading {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.2;
      font-weight: 600;
      color: #000000;
      text-align: center;
      padding-top: calc(13.2pt * var(--spacing-multiplier, 1));
    }

    .resume-content-item {
      padding-bottom: calc(13.2pt * var(--spacing-multiplier, 1));
    }

    .resume-content-item:last-child {
      padding-bottom: 0;
    }

    .resume-category-item {
      padding-bottom: 0;
    }

    .resume-category-item:last-child {
      padding-bottom: 0;
    }

    .resume-period-header {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
    }

    .resume-period-title {
      font-weight: 700;
      font-size: 11pt;
      color: #000000;
    }

    .resume-period-title + .resume-period-location::before {
      content: " • ";
      white-space: pre;
      font-weight: 400;
    }

    .resume-period-dates {
      font-size: 11pt;
      color: #000000;
      white-space: nowrap;
    }

    .resume-period-subtitle-row {
      font-size: 11pt;
      color: #000000;
    }

    .resume-period-subtitle {
      font-size: 11pt;
      color: #000000;
    }

    .resume-period-subtitle + .resume-period-dates::before {
      content: " • ";
      white-space: pre;
    }

    .resume-period-location {
      font-size: 11pt;
      color: #000000;
    }

    .resume-period-body {
      font-size: 11pt;
      color: #000000;
      line-height: 1.2;
    }

    .resume-period-body ul,
    .resume-period-body ol {
      margin: 1pt 0;
      padding-left: 12pt;
    }

    .resume-period-body ul {
      list-style-type: disc;
    }

    .resume-period-body ol {
      list-style-type: decimal;
    }

    .resume-period-body li {
      margin: 0;
      padding: 0;
    }

    .resume-period-body li > p {
      margin: 0;
      display: inline;
    }

    .resume-period-body p {
      margin: 0;
    }

    .resume-period-body strong {
      font-weight: 600;
    }

    .resume-period-body em {
      font-style: italic;
    }

    .resume-category-title {
      font-weight: 600;
      font-size: 11pt;
      color: #000000;
      display: inline;
    }

    .resume-category-body {
      font-size: 11pt;
      color: #000000;
      display: inline;
    }

    .resume-list-body {
      font-size: 11pt;
      color: #000000;
      line-height: 1.2;
    }

    .resume-list-body ul,
    .resume-list-body ol {
      margin: 1pt 0;
      padding-left: 12pt;
    }

    .resume-list-body ul {
      list-style-type: disc;
    }

    .resume-list-body ol {
      list-style-type: decimal;
    }

    .resume-list-body li {
      margin: 0;
      padding: 0;
    }

    .resume-list-body li > p {
      margin: 0;
      display: inline;
    }

    .resume-list-body p {
      margin: 0;
    }

    .resume-list-body strong {
      font-weight: 600;
    }

    .resume-list-body em {
      font-style: italic;
    }

    .cover-letter-root {
      font-family: Arial, sans-serif;
      color: #000000;
      font-size: 11pt;
      line-height: 1.2;
    }

    .cover-letter-page {
      background: white;
      box-sizing: border-box;
    }

    .cover-letter-header {}

    .cover-letter-name {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      font-weight: 600;
      color: #000000;
      line-height: 1.2;
      text-align: center;
    }

    .cover-letter-contact {
      font-size: 11pt;
      line-height: 1.2;
      color: #000000;
      justify-content: center;
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      text-align: center;
    }

    .cover-letter-contact-item + .cover-letter-contact-item::before {
      content: " • ";
      white-space: pre;
    }

    .cover-letter-divider {
      display: none;
    }

    .cover-letter-body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      color: #000000;
      line-height: 1.5;
      text-align: left;
      width: 100%;
      padding-top: calc(13.2pt * var(--spacing-multiplier, 1));
    }

    .cover-letter-body p {
      margin: 0 0 calc(8pt * var(--spacing-multiplier, 1)) 0;
    }

    .cover-letter-body p:last-child {
      margin-bottom: 0;
    }

    .cover-letter-body ul,
    .cover-letter-body ol {
      margin: calc(4pt * var(--spacing-multiplier, 1)) 0;
      padding-left: 12pt;
    }

    .cover-letter-body ul {
      list-style-type: disc;
    }

    .cover-letter-body ol {
      list-style-type: decimal;
    }

    .cover-letter-body li {
      margin: 0;
      padding: 0;
    }

    .cover-letter-body strong {
      font-weight: 600;
    }

    .cover-letter-body em {
      font-style: italic;
    }
  `,
};
