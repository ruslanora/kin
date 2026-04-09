import type { ResumeWithSectionsType } from '@kin/desktop/main/database';
import type { FunctionComponent } from 'react';

type PropsType = {
  resume: ResumeWithSectionsType;
};

export const CoverLetterHeader: FunctionComponent<PropsType> = ({ resume }) => {
  const fullName = [resume.firstName, resume.lastName]
    .filter(Boolean)
    .join(' ');

  const contactItems = [
    resume.address,
    resume.email,
    resume.phone,
    resume.linkedin,
    resume.website,
  ].filter(Boolean);

  return (
    <div className="cover-letter-header">
      {fullName && <h1 className="cover-letter-name">{fullName}</h1>}
      {contactItems.length > 0 && (
        <div className="cover-letter-contact">
          {contactItems.map((item, i) => (
            <span key={i} className="cover-letter-contact-item">
              {item}
            </span>
          ))}
        </div>
      )}
      <hr className="cover-letter-divider" />
    </div>
  );
};
