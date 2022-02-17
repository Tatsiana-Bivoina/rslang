export class TeamMember {
  name: string;
  githubLink: string;
  responsibility: string;
  photoLink: string;

  constructor(name: string, githubLink: string, responsibility: string, photoLink: string) {
    this.name = name;
    this.githubLink = githubLink;
    this.responsibility = responsibility;
    this.photoLink = photoLink;
  }
}
