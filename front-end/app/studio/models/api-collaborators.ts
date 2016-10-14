
export class ApiCollaborator {
    userName: string;
    numChanges: number;

    constructor() {
        this.userName = "";
        this.numChanges = 0;
    }
}

export class ApiCollaborators {
    public totalChanges: number;
    public collaborators: ApiCollaborator[];

    constructor() {
        this.totalChanges = 0;
        this.collaborators = [];
    }
}
