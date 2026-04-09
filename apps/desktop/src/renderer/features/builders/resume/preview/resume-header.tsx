import type { ResumeWithSectionsType } from '@kin/desktop/main/database';
import type { FunctionComponent } from 'react';

type PropsType = {
  resume: ResumeWithSectionsType;
};

export const ResumeHeader: FunctionComponent<PropsType> = ({ resume }) => {
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
    <div className="resume-header" data-resume-header>
      {fullName && <h1 className="resume-name">{fullName}</h1>}
      {resume.title && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--resume-color-accent)',
            marginBottom: 4,
            fontStyle: 'italic',
          }}
        >
          {resume.title}
        </div>
      )}
      {contactItems.length > 0 && (
        <div className="resume-contact">
          {contactItems.map((item, i) => (
            <span key={i} className="resume-contact-item">
              {item}
            </span>
          ))}
        </div>
      )}
      {resume.summary && (
        <>
          <hr className="resume-divider" />
          <p className="resume-summary">{resume.summary}</p>
        </>
      )}
    </div>
  );
};
