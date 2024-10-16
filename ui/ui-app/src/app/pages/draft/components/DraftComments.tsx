import { FunctionComponent, useEffect, useState } from "react";
import {
    Button,
    DataList,
    DataListAction,
    DataListCell,
    DataListContent,
    DataListItem,
    DataListItemCells,
    DataListItemRow,
    DataListToggle,
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateHeader,
    EmptyStateVariant,
    SearchInput,
    Toolbar,
    ToolbarContent,
    ToolbarItem
} from "@patternfly/react-core";
import { FromNow, ListWithToolbar, ObjectDropdown, PleaseWaitModal } from "@apicurio/common-ui-components";
import { Draft } from "@models/drafts";
import { DraftsService, useDraftsService } from "@services/useDraftsService.ts";
import { Comment, NewComment } from "@apicurio/apicurio-registry-sdk/dist/generated-client/models";
import { ConfirmDeleteModal, CreateCommentModal, EditCommentModal, IfOwner } from "@app/components";


export type DraftCommentsProps = {
    draft: Draft;
}

export const DraftComments: FunctionComponent<DraftCommentsProps> = (props: DraftCommentsProps) => {
    const [collapsed, setCollapsed] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPleaseWaitModalOpen, setIsPleaseWaitModalOpen] = useState(false);
    const [pleaseWaitMessage, setPleaseWaitMessage] = useState("");
    const [commentToEdit, setCommentToEdit] = useState<Comment>();
    const [commentToDelete, setCommentToDelete] = useState<Comment>();
    const [filter, setFilter] = useState("");

    const drafts: DraftsService = useDraftsService();

    const toggle = (commentId: string) => {
        if (collapsed.includes(commentId)) {
            setCollapsed(collapsed.filter(item => item !== commentId));
        } else {
            setCollapsed([commentId, ...collapsed]);
        }
    };

    const onEditComment = (comment: Comment): void => {
        setCommentToEdit(comment);
        setIsEditModalOpen(true);
    };

    const onDeleteComment = (comment: Comment): void => {
        setCommentToDelete(comment);
        setIsDeleteModalOpen(true);
    };

    const addComment = (newComment: NewComment): void => {
        setIsCreateModalOpen(false);
        setIsPleaseWaitModalOpen(true);
        setPleaseWaitMessage("Adding comment, please wait.");
        drafts.createDraftComment(props.draft.groupId || "default", props.draft.draftId, props.draft.version, newComment)
            .then((comment: Comment) => {
                setComments([comment, ...comments]);
                setIsPleaseWaitModalOpen(false);
            })
            .catch(() => {
                // TODO handle error
                setIsPleaseWaitModalOpen(false);
            });
    };

    const editComment = (commentId: string, newComment: NewComment): void => {
        console.info("EDITING COMMENT!", commentId, newComment);
        setIsEditModalOpen(false);
        setIsPleaseWaitModalOpen(true);
        setPleaseWaitMessage("Updating comment, please wait.");
        drafts.updateDraftComment(props.draft.groupId || "default", props.draft.draftId, props.draft.version, commentId, newComment)
            .then(() => {
                setComments(comments.map((c: Comment) => {
                    return c.commentId === commentId ? { ...c, value: newComment.value } : c;
                }));
                setIsPleaseWaitModalOpen(false);
            })
            .catch(() => {
                // TODO handle error
                setIsPleaseWaitModalOpen(false);
            });
    };

    const deleteComment = (): void => {
        setIsDeleteModalOpen(false);
        setIsPleaseWaitModalOpen(true);
        setPleaseWaitMessage("Deleting comment, please wait.");

        const commentId: string = commentToDelete?.commentId || "";
        drafts.deleteDraftComment(props.draft.groupId || "default", props.draft.draftId, props.draft.version, commentId)
            .then(() => {
                setComments(comments.filter(c => c.commentId !== commentId));
                setIsPleaseWaitModalOpen(false);
            })
            .catch(() => {
                // TODO handle error
                setIsPleaseWaitModalOpen(false);
            });
    };

    useEffect(() => {
        setIsLoading(true);
        drafts.getDraftComments(props.draft.groupId || "default", props.draft.draftId, props.draft.version)
            .then(comments => {
                setComments(comments);
                setIsLoading(false);
            })
            .catch(() => {
                // TODO handle error
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        setFilteredComments(comments.filter(comment => {
            return comment.value?.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        }));
    }, [comments, filter]);

    const toolbar = (
        <Toolbar id="toolbar-items-example">
            <ToolbarContent>
                <ToolbarItem variant="search-filter">
                    <SearchInput aria-label="Search comments" placeholder="Filter comments" onChange={(_evt, filter) => setFilter(filter)} />
                </ToolbarItem>
                <ToolbarItem variant="separator" />
                <ToolbarItem>
                    <Button variant="secondary" onClick={() => setIsCreateModalOpen(true)}>Add comment</Button>
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );

    const emptyState = (
        <EmptyState variant={EmptyStateVariant.xs}>
            <EmptyStateHeader titleText="No comments found" headingLevel="h4" />
            <EmptyStateBody>
                There are no comments yet created for this artifact version.
            </EmptyStateBody>
            <EmptyStateFooter>
                <EmptyStateActions>
                    <Button variant="secondary" onClick={() => { setIsCreateModalOpen(true); }}>Add comment</Button>
                </EmptyStateActions>
            </EmptyStateFooter>
        </EmptyState>
    );

    const filteredEmptyState = (
        <EmptyState variant={EmptyStateVariant.xs}>
            <EmptyStateHeader titleText="No comments found" headingLevel="h4" />
            <EmptyStateBody>
                There are no comments that match the filter criteria.
            </EmptyStateBody>
        </EmptyState>
    );

    return (
        <div className="comments">
            <ListWithToolbar
                toolbar={toolbar}
                emptyState={emptyState}
                filteredEmptyState={filteredEmptyState}
                alwaysShowToolbar={false}
                isLoading={isLoading}
                isError={false}
                isFiltered={filter.trim().length > 0}
                isEmpty={filteredComments.length === 0}
            >
                <DataList aria-label="Compact data list example" isCompact>
                    {
                        filteredComments.map( (comment, /* idx */) =>
                            <DataListItem key={comment.commentId!} aria-labelledby={`${comment.commentId}-compact`} isExpanded={!collapsed.includes(comment.commentId!)}>
                                <DataListItemRow>
                                    <DataListToggle
                                        onClick={() => toggle(comment.commentId!)}
                                        isExpanded={!collapsed.includes(comment.commentId!)}
                                        id={`${comment.commentId}-toggle`}
                                        aria-controls={`${comment.commentId}-expand`}
                                    />
                                    <DataListItemCells
                                        dataListCells={[
                                            <DataListCell key="primary content">
                                                <span id={`${comment.commentId}-compact`}>
                                                    <span><b>{comment.owner || "Anonymous"}</b></span>
                                                    <span> added a comment </span>
                                                    <span>
                                                        <em><FromNow date={comment.createdOn} /></em>
                                                    </span>
                                                </span>
                                            </DataListCell>
                                        ]}
                                    />
                                    <DataListAction
                                        aria-labelledby="ex-item1 ex-action1"
                                        id="ex-action1"
                                        aria-label="Actions"
                                        isPlainButtonAction
                                    >
                                        <IfOwner owner={comment.owner}>
                                            <ObjectDropdown
                                                items={[
                                                    {
                                                        label: "Edit",
                                                        testId: `${comment.commentId}-actions-edit`,
                                                        onClick: () => onEditComment(comment)
                                                    },
                                                    {
                                                        isSeparator: true
                                                    },
                                                    {
                                                        label: "Delete",
                                                        testId: `${comment.commentId}-actions-delete`,
                                                        onClick: () => onDeleteComment(comment)
                                                    }
                                                ]}
                                                isKebab={true}
                                                label="Actions"
                                                itemToString={item => item.label}
                                                itemToTestId={item => item.testId}
                                                itemIsDivider={item => item.isSeparator}
                                                onSelect={item => item.onClick()}
                                                testId={`${comment.commentId}-actions`}
                                                popperProps={{
                                                    position: "right"
                                                }}
                                            />
                                        </IfOwner>
                                    </DataListAction>
                                </DataListItemRow>
                                <DataListContent
                                    aria-label={`Comment content for ${comment.commentId}`}
                                    id={`${comment.commentId}-expand`}
                                    isHidden={collapsed.includes(comment.commentId!)}
                                    hasNoPadding
                                >
                                    <div style={{ paddingLeft: "35px", marginBottom: "15px" }}>
                                        {comment.value}
                                    </div>
                                </DataListContent>
                            </DataListItem>
                        )
                    }
                </DataList>
            </ListWithToolbar>
            <CreateCommentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateComment={addComment}
            />
            <EditCommentModal
                isOpen={isEditModalOpen}
                comment={commentToEdit!}
                onClose={() => setIsEditModalOpen(false)}
                onEditComment={editComment}
            />
            <ConfirmDeleteModal
                title="Delete comment?"
                message="Do you really want to delete this comment?  This operation cannot be undone."
                isOpen={isDeleteModalOpen}
                onDelete={deleteComment}
                onClose={() => setIsDeleteModalOpen(false)}
            />
            <PleaseWaitModal
                message={pleaseWaitMessage}
                isOpen={isPleaseWaitModalOpen}
            />
        </div>
    );
};
