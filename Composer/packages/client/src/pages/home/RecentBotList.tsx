// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable react/display-name */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { IObjectWithKey } from 'office-ui-fabric-react/lib/MarqueeSelection';
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  CheckboxVisibility,
} from 'office-ui-fabric-react/lib/DetailsList';
import formatMessage from 'format-message';

import { calculateTimeDiff } from '../../utils';

import { detailListContainer, tableCell, content } from './styles';

interface RecentBotListProps {
  onItemChosen: (file: IObjectWithKey) => void;
  recentProjects: any;
}
export function RecentBotList(props: RecentBotListProps): JSX.Element {
  const { onItemChosen, recentProjects } = props;
  // for detail file list in open panel
  const tableColums = [
    {
      key: 'column1',
      name: formatMessage('Name'),
      fieldName: 'name',
      minWidth: 150,
      maxWidth: 200,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: formatMessage('Sorted A to Z'),
      sortDescendingAriaLabel: formatMessage('Sorted Z to A'),
      data: 'string',
      onRender: (item) => {
        return (
          <div css={tableCell} data-is-focusable>
            <Link
              aria-label={formatMessage(`Bot name is {botName}`, { botName: item.name })}
              onClick={() => onItemChosen(item)}
            >
              {item.name}
            </Link>
          </div>
        );
      },
      isPadded: true,
    },
    {
      key: 'column2',
      name: formatMessage('Date Modified'),
      fieldName: 'dateModifiedValue',
      minWidth: 60,
      maxWidth: 70,
      isResizable: true,
      data: 'number',
      onRender: (item) => {
        return (
          <div css={tableCell} data-is-focusable>
            <div
              aria-label={formatMessage(`Last modified time is {time}`, { time: calculateTimeDiff(item.dateModified) })}
              css={content}
              tabIndex={-1}
            >
              {calculateTimeDiff(item.dateModified)}
            </div>
          </div>
        );
      },
      isPadded: true,
    },
  ];

  function onRenderDetailsHeader(props, defaultRender) {
    return (
      <Sticky isScrollSynced stickyPosition={StickyPositionType.Header}>
        {defaultRender({
          ...props,
          onRenderColumnHeaderTooltip: (tooltipHostProps) => <TooltipHost {...tooltipHostProps} />,
        })}
      </Sticky>
    );
  }

  return (
    <div css={detailListContainer} data-is-scrollable="true">
      <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
        <DetailsList
          checkboxVisibility={CheckboxVisibility.hidden}
          columns={tableColums}
          compact={false}
          getKey={(item) => item.name}
          isHeaderVisible
          items={recentProjects}
          layoutMode={DetailsListLayoutMode.justified}
          onItemInvoked={onItemChosen}
          onRenderDetailsHeader={onRenderDetailsHeader}
          selectionMode={SelectionMode.single}
        />
      </ScrollablePane>
    </div>
  );
}
