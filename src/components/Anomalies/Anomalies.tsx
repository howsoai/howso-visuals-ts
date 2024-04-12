import { ReactNode } from "react";

/**
 *
 * @see https://plotly.com/javascript/subplots/
 */
export const Anomalies = (): ReactNode => {
  return <></>;
};

/*
def compose_figures(
    figures: List[go.Figure],
    rows: int,
    cols: int,
    **make_subplots_kwargs,
) -> go.Figure:
    """
    Helper function for composing several plotly `Figure`s.

    This is particularly useful for `Figure`s created by ``plotly.express``. Any
    unspecified keyword arguments are passed to ``plotly.subplots.make_subplots``.

    Parameters
    ----------
    figures : List[go.Figure]
        The `Figure`s to compose in the order to compose them.
    rows : int
        The number of rows to include in the composed `Figure`.
    cols : int
        The number of columns to include in the composed `Figure`.

    Returns
    -------
    go.Figure
        The composed `Figure`.
    """
    figure_trace_map: Dict[Tuple[int, int], List] = {}
    subplot_titles = []

    if rows < 1 or cols < 1:
        raise ValueError("Neither `rows` nor `cols` can be less than 1.")

    if rows * cols < len(figures):
        raise ValueError(f"A {rows}x{cols} grid of subplots cannot fit {len(figures)} figures.")

    # The figures to compose may be fewer than the total number of cells,
    # e.g. when  we fill a 2x2 grid with 3 subplots. The fig_counter helps
    # to break out when we are out of figures.
    fig_counter = 0
    for i in range(1, rows + 1):
        for j in range(1, cols + 1):
            figure_trace_map[(i, j)] = [
                t for t in figures[fig_counter]["data"]
            ]
            subplot_titles.append(figures[fig_counter]["layout"]["title"]["text"])
            fig_counter += 1

            if fig_counter == len(figures):
                break

    for k in {"rows", "cols", "subplot_titles"}:
        make_subplots_kwargs.pop(k, None)

    return_figure = make_subplots(rows=rows, cols=cols, subplot_titles=subplot_titles, **make_subplots_kwargs)
    for key, value in figure_trace_map.items():
        row, col = key
        return_figure.add_traces(value, rows=row, cols=col)

    # Remove duplicate entries from the legend
    legend_names = set()
    return_figure.for_each_trace(
        lambda t: t.update(showlegend=False) if t.name in legend_names else legend_names.add(t.name)
    )

    # Multiple subplots may have the same bingroup specified, so we override that here.
    for i in range(1, rows + 1):
        for j in range(1, cols + 1):
            return_figure.update_traces(bingroup=f"subplot_{i},{j}", row=i, col=j)

    return return_figure
    */
