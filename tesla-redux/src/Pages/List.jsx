import {
  Box,
  Button,
  FormLabel,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar } from "../Components/Navbar";
import {
  filterByState,
  filterByYear,
  sortByAge,
  userData,
  userDelete,
} from "../Redux/App/action";
import { EditModal } from "./EditModal";
import { Pagination } from "./Pagination";

export const List = () => {
  const dispatch = useDispatch();
  const filterData = useSelector((state) => state.AppReducer.filterData);
  const users = useSelector((state) => state.AppReducer.user);
  const isLoading = useSelector((state) => state.AppReducer.isLoading);

  const [page, setPage] = useState(1);
  let perPage = 3;
  let totalPage = Math.ceil(users.length / perPage);

  let end = page * perPage;
  let start = end - perPage;

  let paginateData = filterData.slice(start, end);

  const handleFilterByState = (e) => {
    let fData = users.filter((el) => {
      return el.state === e.target.value;
    });
    // console.log(fData);
    dispatch(filterByState(fData));
  };

  const handleFilterByYear = (e) => {
    let fData = users.filter((el) => {
      return el.year === e.target.value;
    });
    // console.log(fData);
    dispatch(filterByYear(fData));
  };

  const handleSortByAge = (e) => {
    const query = e.target.value;

    if (query === "asc") {
      filterData.sort((a, b) => {
        return a.age - b.age;
      });
    } else {
      filterData.sort((a, b) => {
        return b.age - a.age;
      });
    }
    let sortedArray = [...filterData];
    dispatch(sortByAge(sortedArray));
  };

  const handleDelete = (id) => {
    dispatch(userDelete(id));
  };

  useEffect(() => {
    dispatch(userData());
  }, []);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <Navbar />

      <Box display="inline-flex" m={4}>
        <Select placeholder="Filter By State" onChange={handleFilterByState}>
          <option value="delhi">delhi</option>
          <option value="mp">MP</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="bihar">Bihar</option>
          <option value="up">UP</option>
        </Select>

        <Select placeholder="Filter By Year" onChange={handleFilterByYear}>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </Select>

        <Select placeholder="Sort By Age" onChange={handleSortByAge}>
          <option value="asc">LOW TO HIGH</option>
          <option value="desc">HIGH TO LOW</option>
        </Select>
      </Box>

      <div>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Age</Th>
              <Th>State</Th>
              <Th>Year</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginateData?.map((item) => {
              return (
                <Tr key={item.id}>
                  <Td>{item.name}</Td>
                  <Td>{item.age}</Td>
                  <Td>{item.state}</Td>
                  <Td>{item.year}</Td>
                  <Td>
                    <EditModal id={item.id} />
                  </Td>
                  <Td>
                    <Button onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </div>

      <Pagination page={page} setPage={setPage} totalPage={totalPage} />
    </>
  );
};
