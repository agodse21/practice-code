import { render, screen } from "@testing-library/react";
import App from "../App";
import { Add } from "./Add";
import userEvent from "@testing-library/user-event";
import { Reduce } from "./Reduce";
// import renderer from "react-test-renderer"
describe("testinng the button components", () => {

  it("should render without any error", () => {
    render(<App />);
    let Addbutton = screen.getByTestId("AddBtn");
    let Reducebutton = screen.getByTestId("ReduceBtn");

    expect(Addbutton).toBeInTheDocument();
    expect(Reducebutton).toBeInTheDocument();
  });




  it("should have add and reduce buttons", () => {
    render(<Add>Add</Add>);
    render(<Reduce>Reduce</Reduce>)
    // screen.debug();
    let Addbutton = screen.getByText("Add");
    expect(Addbutton).toBeInTheDocument();
    let Reducebutton = screen.getByText("Reduce");
    expect(Reducebutton).toBeInTheDocument();

  });

  it("should have an element with counter value as default ( 0 )", () => {
    render(<App />);
    let h2Tag = screen.getByText("Count:0");
    expect(h2Tag).toHaveTextContent("0");

  });

  it("onClick of ADD, value of Counter should increment by 5", () => {
   
    const mockFn=jest.fn();
    render(<Add onClick={mockFn}>Checking onClick</Add>);
    
    
    let AddBtn = screen.getByTestId("AddBtn");
    userEvent.click(AddBtn);
    expect(mockFn).toBeCalled();
    // expect(screen.getByTestId("counter-text")).toHaveTextContent("5");

  });

  it("onClick of ADD, value of Counter should increment by 5", () => {
    render(<App />);
  
    let AddBtn = screen.getByTestId("AddBtn");
    userEvent.click(AddBtn);
    // expect(mockFn).toBeCalled();
    expect(screen.getByTestId("counter-text")).toHaveTextContent("5");

  });
  it("onClick of REDUCE, the value of Counter should decrement by 5", () => {
    render(<App />);
  
    let ReduceBtn = screen.getByTestId("ReduceBtn");
    userEvent.click(ReduceBtn);
    // expect(mockFn).toBeCalled();
    expect(screen.getByTestId("counter-text")).toHaveTextContent("-5");

  });

  

});
